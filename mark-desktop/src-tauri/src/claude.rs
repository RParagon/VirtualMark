use std::collections::HashMap;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{Duration, Instant};

use serde_json::{json, Value};
use tauri::{AppHandle, Emitter, Manager};

use crate::painel::{Alerta, Item, Nivel, Painel};

// Sessões do Claude Code no PC, pela mesma técnica do Coucou: hooks do Claude Code chamam
// o próprio Mark.exe com --mark-hook, que repassa o evento para o app por uma porta local.
// Se o Mark estiver fechado, o relé sai na hora e o Claude não trava.

pub const FLAG: &str = "--mark-hook";
const PORTA: u16 = 47321;
const EVENTOS: [&str; 5] = ["UserPromptSubmit", "PreToolUse", "Notification", "Stop", "SessionEnd"];
const ESQUECER_DEPOIS: Duration = Duration::from_secs(30 * 60);

/// Modo relé: lê o JSON do hook no stdin e entrega ao app. Sempre sai com 0.
pub fn rele() {
    let mut entrada = String::new();
    let _ = std::io::stdin().read_to_string(&mut entrada);
    if let Ok(mut s) = TcpStream::connect_timeout(&([127, 0, 0, 1], PORTA).into(), Duration::from_millis(300)) {
        let _ = s.set_write_timeout(Some(Duration::from_millis(500)));
        let _ = s.write_all(entrada.as_bytes());
    }
}

#[derive(Clone, Copy, PartialEq)]
enum Estado {
    Trabalhando,
    Esperando,
    Terminou,
}

struct Sessao {
    pasta: String,
    estado: Estado,
    desde: Instant,
    mensagem: String,
}

#[derive(Default)]
pub struct Sessoes(Mutex<HashMap<String, Sessao>>, Mutex<&'static str>);

fn nome_pasta(cwd: &str) -> String {
    cwd.trim_end_matches(['\\', '/']).rsplit(['\\', '/']).next().unwrap_or(cwd).to_string()
}

fn painel(sessoes: &HashMap<String, Sessao>) -> Painel {
    let mut lista: Vec<&Sessao> = sessoes.values().collect();
    lista.sort_by_key(|s| (s.estado != Estado::Esperando, s.estado != Estado::Trabalhando, std::cmp::Reverse(s.desde)));
    let esperando = lista.iter().filter(|s| s.estado == Estado::Esperando).count();
    let trabalhando = lista.iter().filter(|s| s.estado == Estado::Trabalhando).count();
    let nivel = if esperando > 0 {
        Nivel::Atencao
    } else if trabalhando > 0 {
        Nivel::Trabalhando
    } else if lista.is_empty() {
        Nivel::Nenhum
    } else {
        Nivel::Ok
    };
    let itens = lista
        .iter()
        .map(|s| Item {
            titulo: if s.mensagem.is_empty() { s.pasta.clone() } else { format!("{} · {}", s.pasta, s.mensagem) },
            detalhe: match s.estado {
                Estado::Trabalhando => "trabalhando".into(),
                Estado::Esperando => "esperando você".into(),
                Estado::Terminou => "terminou".into(),
            },
            atencao: s.estado == Estado::Esperando,
            link: None,
        })
        .collect();
    Painel {
        fonte: "claude",
        nivel,
        numero: if lista.is_empty() { "0".into() } else { format!("{}/{}", esperando + trabalhando, lista.len()) },
        itens,
        vazio: "Nenhuma sessão do Claude Code aberta agora.".into(),
    }
}

fn receber(app: &AppHandle, dados: Value) {
    let evento = dados["hook_event_name"].as_str().unwrap_or_default();
    let id = dados["session_id"].as_str().unwrap_or("?").to_string();
    let pasta = nome_pasta(dados["cwd"].as_str().unwrap_or("Claude"));
    let sessoes = app.state::<Sessoes>();
    let mut mapa = sessoes.0.lock().unwrap();
    mapa.retain(|_, s| s.estado != Estado::Terminou || s.desde.elapsed() < ESQUECER_DEPOIS);

    let anterior = mapa.get(&id).map(|s| s.estado);
    let novo = match evento {
        "UserPromptSubmit" | "PreToolUse" => Some(Estado::Trabalhando),
        "Notification" => Some(Estado::Esperando),
        "Stop" => Some(Estado::Terminou),
        "SessionEnd" => {
            mapa.remove(&id);
            None
        }
        _ => return,
    };
    if let Some(estado) = novo {
        let mensagem = if estado == Estado::Esperando { dados["message"].as_str().unwrap_or_default().to_string() } else { String::new() };
        mapa.insert(id, Sessao { pasta: pasta.clone(), estado, desde: Instant::now(), mensagem });
    }

    // Animações do Mark e alertas.
    if novo != anterior {
        match novo {
            Some(Estado::Esperando) => {
                let _ = app.emit("regra:alerta", Alerta { fonte: "claude", texto: format!("O Claude está esperando você em {pasta}.") });
            }
            Some(Estado::Terminou) => {
                let _ = app.emit("mark:estado", json!({ "estado": "review", "vezes": 2 }));
            }
            _ => {}
        }
    }
    let algum_trabalhando = mapa.values().any(|s| s.estado == Estado::Trabalhando);
    let base = if algum_trabalhando { "running" } else { "idle" };
    let mut ultima_base = sessoes.1.lock().unwrap();
    if *ultima_base != base {
        *ultima_base = base;
        let _ = app.emit("mark:estado", json!({ "estado": base }));
    }
    drop(ultima_base);

    let p = painel(&mapa);
    drop(mapa);
    let _ = app.emit("status", &p);
    app.state::<crate::monitor::Monitor>().paineis.lock().unwrap().insert("claude", p);
}

pub fn iniciar(app: &AppHandle) {
    app.manage(Sessoes(Mutex::default(), Mutex::new("idle")));
    let inicial = painel(&HashMap::new());
    let _ = app.emit("status", &inicial);
    app.state::<crate::monitor::Monitor>().paineis.lock().unwrap().insert("claude", inicial);
    let app = app.clone();
    std::thread::spawn(move || {
        let Ok(escuta) = TcpListener::bind(("127.0.0.1", PORTA)) else { return };
        for conexao in escuta.incoming().flatten() {
            let mut s = conexao;
            let _ = s.set_read_timeout(Some(Duration::from_secs(2)));
            let mut corpo = String::new();
            let _ = s.read_to_string(&mut corpo);
            if let Ok(dados) = serde_json::from_str::<Value>(&corpo) {
                receber(&app, dados);
            }
        }
    });
}

// ---------- Instalação dos hooks ----------

fn settings() -> Result<PathBuf, String> {
    let casa = std::env::var_os("USERPROFILE").or_else(|| std::env::var_os("HOME")).ok_or("pasta do usuário não encontrada")?;
    Ok(PathBuf::from(casa).join(".claude").join("settings.json"))
}

fn eh_nosso(h: &Value) -> bool {
    h["command"].as_str().map_or(false, |c| c.contains(FLAG))
}

/// Junta os hooks do Mark ao settings.json do Claude Code, com backup antes.
pub fn instalar_hooks() -> Result<String, String> {
    let caminho = settings()?;
    let exe = std::env::current_exe().map_err(|e| e.to_string())?;
    let comando = format!("\"{}\" {FLAG}", exe.display()).replace('\\', "/");

    let mut cfg: Value = match std::fs::read_to_string(&caminho) {
        Ok(t) => serde_json::from_str(&t).map_err(|e| format!("settings.json inválido: {e}"))?,
        Err(_) => json!({}),
    };
    if caminho.exists() {
        std::fs::copy(&caminho, caminho.with_extension("json.mark-backup")).map_err(|e| e.to_string())?;
    }
    if !cfg.is_object() {
        return Err("settings.json não é um objeto JSON".into());
    }
    let hooks = cfg.as_object_mut().unwrap().entry("hooks").or_insert_with(|| json!({}));
    let hooks = hooks.as_object_mut().ok_or("\"hooks\" no settings.json não é um objeto")?;
    for evento in EVENTOS {
        let lista = hooks.entry(evento).or_insert_with(|| json!([]));
        let Some(lista) = lista.as_array_mut() else { continue };
        // Tira versões antigas do Mark antes de pôr a atual.
        for grupo in lista.iter_mut() {
            if let Some(hs) = grupo["hooks"].as_array_mut() {
                hs.retain(|h| !eh_nosso(h));
            }
        }
        lista.retain(|g| g["hooks"].as_array().map_or(true, |hs| !hs.is_empty()));
        let mut grupo = json!({ "hooks": [{ "type": "command", "command": comando, "timeout": 5 }] });
        if evento == "PreToolUse" {
            grupo["matcher"] = json!("*");
        }
        lista.push(grupo);
    }
    if let Some(pasta) = caminho.parent() {
        std::fs::create_dir_all(pasta).map_err(|e| e.to_string())?;
    }
    let texto = serde_json::to_string_pretty(&cfg).map_err(|e| e.to_string())?;
    std::fs::write(&caminho, texto).map_err(|e| e.to_string())?;
    Ok(caminho.display().to_string())
}

pub fn hooks_instalados() -> bool {
    settings()
        .ok()
        .and_then(|c| std::fs::read_to_string(c).ok())
        .map_or(false, |t| t.contains(FLAG))
}

#[cfg(test)]
mod testes {
    use super::*;

    #[test]
    fn instala_hooks_sem_apagar_os_existentes_e_sem_duplicar() {
        let dir = std::env::temp_dir().join(format!("mark-teste-{}", std::process::id()));
        std::fs::create_dir_all(dir.join(".claude")).unwrap();
        let arq = dir.join(".claude/settings.json");
        std::fs::write(&arq, r#"{"model":"x","hooks":{"Stop":[{"hooks":[{"type":"command","command":"echo oi"}]}]}}"#).unwrap();
        std::env::set_var("HOME", &dir);
        std::env::remove_var("USERPROFILE");
        instalar_hooks().unwrap();
        instalar_hooks().unwrap();
        let cfg: Value = serde_json::from_str(&std::fs::read_to_string(&arq).unwrap()).unwrap();
        assert_eq!(cfg["model"], "x");
        let stop = cfg["hooks"]["Stop"].as_array().unwrap();
        assert_eq!(stop.len(), 2);
        assert_eq!(stop[0]["hooks"][0]["command"], "echo oi");
        assert_eq!(cfg["hooks"]["PreToolUse"][0]["matcher"], "*");
        assert!(dir.join(".claude/settings.json.mark-backup").exists());
        std::fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn pasta_do_cwd() {
        assert_eq!(nome_pasta(r"E:\Paragon\VirtualMark\"), "VirtualMark");
        assert_eq!(nome_pasta("/home/user/site"), "site");
    }
}
