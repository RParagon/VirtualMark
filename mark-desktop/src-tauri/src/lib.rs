mod ads;
mod asana;
mod claude;
mod cofre;
mod config;
mod monitor;
mod net;
mod painel;

use serde::Serialize;
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::TrayIconBuilder,
    AppHandle, Emitter, Manager, PhysicalPosition, State, WebviewWindow,
};

use config::{Config, Preferencias};
use monitor::Monitor;

pub use claude::{rele as rele_hook, FLAG as FLAG_HOOK};
use painel::Painel;

// Tamanhos lógicos das janelas (iguais aos de tauri.conf.json).
const ILHA_LARGURA: f64 = 460.0;
const MARK_LARGURA: f64 = 104.0;
const MARK_ALTURA: f64 = 112.0;

/// Área útil do monitor (sem a barra de tarefas), em pixels físicos.
#[derive(Serialize)]
struct Area {
    x: i32,
    y: i32,
    largura: u32,
    altura: u32,
    escala: f64,
}

#[tauri::command]
fn area_trabalho(window: WebviewWindow) -> Option<Area> {
    let m = window
        .current_monitor()
        .ok()
        .flatten()
        .or_else(|| window.primary_monitor().ok().flatten())?;
    let a = m.work_area();
    Some(Area {
        x: a.position.x,
        y: a.position.y,
        largura: a.size.width,
        altura: a.size.height,
        escala: m.scale_factor(),
    })
}

/// Posição do cursor na tela (pixels físicos), para o Mark olhar para ele.
#[tauri::command]
fn cursor(app: AppHandle) -> Option<(f64, f64)> {
    app.cursor_position().ok().map(|p| (p.x, p.y))
}

#[tauri::command]
fn status_atual(monitor: State<Monitor>) -> Vec<Painel> {
    monitor.paineis.lock().unwrap().values().cloned().collect()
}

#[tauri::command]
fn tem_token(nome: String) -> bool {
    cofre::ler(&nome).is_some()
}

/// Guarda (ou apaga, se vier vazio) um token e consulta de novo na hora.
#[tauri::command]
fn salvar_token(nome: String, valor: String, monitor: State<Monitor>) -> Result<(), String> {
    if nome != monitor::TOKEN_ASANA {
        return Err("token desconhecido".into());
    }
    cofre::gravar(&nome, &valor)?;
    monitor.atualizar_agora();
    Ok(())
}

#[tauri::command]
fn ads_env_padrao() -> &'static str {
    ads::ENV_PADRAO
}

/// Importa as credenciais do Google Ads do .env do analise-cpa (fica tudo no PC).
#[tauri::command]
fn importar_ads(caminho: String, monitor: State<Monitor>) -> Result<(), String> {
    ads::importar_env(&caminho)?;
    monitor.atualizar_agora();
    Ok(())
}

#[tauri::command]
fn hooks_instalados() -> bool {
    claude::hooks_instalados()
}

#[tauri::command]
fn instalar_hooks() -> Result<String, String> {
    claude::instalar_hooks()
}

#[tauri::command]
fn remover_hooks() -> Result<(), String> {
    claude::remover_hooks()
}

#[tauri::command]
fn testar_hooks() -> Result<(), String> {
    claude::testar()
}

#[derive(Serialize)]
struct Conexoes {
    asana: bool,
    ads: bool,
    claude: bool,
}

#[tauri::command]
fn conexoes() -> Conexoes {
    Conexoes { asana: cofre::ler(monitor::TOKEN_ASANA).is_some(), ads: ads::conectado(), claude: claude::hooks_instalados() }
}

#[tauri::command]
fn desconectar(fonte: String, monitor: State<Monitor>) -> Result<(), String> {
    match fonte.as_str() {
        "asana" => cofre::gravar(monitor::TOKEN_ASANA, "")?,
        "ads" => ads::desconectar()?,
        _ => return Err("fonte desconhecida".into()),
    }
    monitor.atualizar_agora();
    Ok(())
}

#[tauri::command]
fn ler_config(prefs: State<Preferencias>) -> Config {
    prefs.0.lock().unwrap().clone()
}

#[tauri::command]
fn salvar_config(app: AppHandle, cfg: Config, prefs: State<Preferencias>, monitor: State<Monitor>) -> Result<(), String> {
    config::salvar(&app, &cfg)?;
    *prefs.0.lock().unwrap() = cfg.clone();
    let _ = app.emit("config", &cfg);
    monitor.atualizar_agora();
    Ok(())
}

#[tauri::command]
fn abrir_config(app: AppHandle) {
    abrir_janela_config(&app);
}

/// Mesmos argumentos em todas as janelas (o WebView2 exige) para gastar menos memória.
pub const ARGS_WEBVIEW: &str = "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection \
    --renderer-process-limit=1 --disable-background-networking --disable-extensions";

/// A tela de Configurações só existe enquanto está aberta (fechada, não gasta RAM).
fn abrir_janela_config(app: &AppHandle) {
    if let Some(j) = app.get_webview_window("config") {
        let _ = j.unminimize();
        let _ = j.set_focus();
        return;
    }
    let _ = tauri::WebviewWindowBuilder::new(app, "config", tauri::WebviewUrl::App("config.html".into()))
        .title("Mark · Configurações")
        .inner_size(560.0, 720.0)
        .min_inner_size(480.0, 480.0)
        .center()
        .additional_browser_args(ARGS_WEBVIEW)
        .build();
}

/// Conclui uma tarefa no Asana. Só roda quando o Rafael confirma o clique na barra.
#[tauri::command]
fn concluir_tarefa(id: String, monitor: State<Monitor>) -> Result<(), String> {
    let token = cofre::ler(monitor::TOKEN_ASANA).ok_or("Asana não conectado")?;
    asana::concluir(&token, &id)?;
    monitor.atualizar_agora();
    Ok(())
}

/// Esconde uma tarefa da barra (não mexe no Asana).
#[tauri::command]
fn ocultar_tarefa(app: AppHandle, id: String, prefs: State<Preferencias>, monitor: State<Monitor>) -> Result<(), String> {
    let cfg = {
        let mut c = prefs.0.lock().unwrap();
        if !c.asana_ocultas.contains(&id) {
            c.asana_ocultas.push(id);
        }
        c.clone()
    };
    config::salvar(&app, &cfg)?;
    monitor.atualizar_agora();
    Ok(())
}

#[tauri::command]
fn atualizar(monitor: State<Monitor>) {
    monitor.atualizar_agora();
}

/// Barra no topo, centralizada; Mark no canto inferior direito, acima da barra de tarefas.
fn posicionar(app: &AppHandle) {
    let (Some(ilha), Some(mark)) = (app.get_webview_window("ilha"), app.get_webview_window("mark")) else {
        return;
    };
    if let Ok(Some(m)) = ilha.primary_monitor() {
        let a = m.work_area();
        let e = m.scale_factor();
        let (ax, ay) = (a.position.x, a.position.y);
        let (aw, ah) = (a.size.width as i32, a.size.height as i32);
        // A ilha sai colada na borda de cima do monitor, como um notch.
        let (mx, my) = (m.position().x, m.position().y);
        let mw_total = m.size().width as i32;
        let iw = (ILHA_LARGURA * e) as i32;
        let _ = ilha.set_position(PhysicalPosition::new(mx + (mw_total - iw) / 2, my));
        let mw = (MARK_LARGURA * e) as i32;
        let mh = (MARK_ALTURA * e) as i32;
        let _ = mark.set_position(PhysicalPosition::new(ax + aw - mw - (32.0 * e) as i32, ay + ah - mh));
    }
    let _ = ilha.show();
    let _ = mark.show();
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![area_trabalho, cursor, testar_hooks, status_atual, tem_token, salvar_token, ads_env_padrao, importar_ads, hooks_instalados, instalar_hooks, remover_hooks, conexoes, desconectar, ler_config, salvar_config, abrir_config, concluir_tarefa, ocultar_tarefa, atualizar])
        .setup(|app| {
            let cfg = config::carregar(app.handle());
            app.manage(Preferencias(std::sync::Mutex::new(cfg)));
            // Estado pronto antes de mostrar as janelas, para a barra não perder o primeiro status.
            monitor::iniciar(app.handle());
            claude::iniciar(app.handle());
            posicionar(app.handle());

            let demo = MenuItem::with_id(app, "demo", "Testar animações", true, None::<&str>)?;
            let teste = MenuItem::with_id(app, "alerta-teste", "Testar um alerta", true, None::<&str>)?;
            let atualizar = MenuItem::with_id(app, "atualizar", "Atualizar agora", true, None::<&str>)?;
            let configurar = MenuItem::with_id(app, "config", "Configurações…", true, None::<&str>)?;
            let pausar = MenuItem::with_id(app, "pausar", "Pausar alertas por 1 hora", true, None::<&str>)?;
            let sep = PredefinedMenuItem::separator(app)?;
            let sep2 = PredefinedMenuItem::separator(app)?;
            let sair = MenuItem::with_id(app, "sair", "Sair", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&configurar, &atualizar, &pausar, &sep, &demo, &teste, &sep2, &sair])?;

            let mut bandeja = TrayIconBuilder::with_id("mark")
                .tooltip("Mark")
                .menu(&menu)
                .on_menu_event(|app, ev| match ev.id().as_ref() {
                    "sair" => app.exit(0),
                    "atualizar" => {
                        app.state::<Monitor>().atualizar_agora();
                        let _ = app.emit("bandeja", "atualizar");
                    }
                    "config" => abrir_janela_config(app),
                    id => {
                        let _ = app.emit("bandeja", id.to_string());
                    }
                });
            if let Some(icone) = app.default_window_icon() {
                bandeja = bandeja.icon(icone.clone());
            }
            bandeja.build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("não foi possível iniciar o Mark");
}
