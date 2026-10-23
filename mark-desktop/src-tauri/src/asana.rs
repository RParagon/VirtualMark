use std::collections::HashSet;

use chrono::{Datelike, Local, NaiveDate};
use serde::Deserialize;

use crate::config::Config;
use crate::net;
use crate::painel::{Alerta, Item, Nivel, Painel};

// Lê as tarefas abertas atribuídas ao Rafael (inclui subtarefas) e aplica regras simples de data.

const API: &str = "https://app.asana.com/api/1.0";

#[derive(Deserialize)]
struct Resposta<T> {
    data: T,
    next_page: Option<Pagina>,
}

#[derive(Deserialize)]
struct Pagina {
    offset: String,
}

#[derive(Deserialize)]
struct Eu {
    gid: String,
    workspaces: Vec<Ref>,
}

#[derive(Deserialize, Clone)]
struct Ref {
    gid: String,
    name: Option<String>,
}

#[derive(Deserialize, Clone)]
pub struct Tarefa {
    gid: String,
    name: String,
    due_on: Option<String>,
    permalink_url: Option<String>,
    parent: Option<Ref>,
    modified_at: Option<String>,
}

fn get<T: for<'de> Deserialize<'de>>(token: &str, url: &str) -> Result<Resposta<T>, String> {
    net::com_retentativa(|| net::agente().get(url).set("Authorization", &format!("Bearer {token}")).call())
        .map_err(|e| match e {
            ureq::Error::Status(401, _) => "token do Asana inválido ou revogado".to_string(),
            e => net::explicar(&e),
        })?
        .into_json()
        .map_err(|e| e.to_string())
}

/// Marca uma tarefa como concluída (só quando o Rafael clica em "concluir").
pub fn concluir(token: &str, gid: &str) -> Result<(), String> {
    if !gid.chars().all(|c| c.is_ascii_digit()) {
        return Err("id de tarefa inválido".into());
    }
    net::agente()
        .put(&format!("{API}/tasks/{gid}"))
        .set("Authorization", &format!("Bearer {token}"))
        .send_json(serde_json::json!({ "data": { "completed": true } }))
        .map(|_| ())
        .map_err(|e| net::explicar(&e))
}

pub fn buscar(token: &str) -> Result<Vec<Tarefa>, String> {
    let eu: Resposta<Eu> = get(token, &format!("{API}/users/me?opt_fields=gid,workspaces.gid"))?;
    let mut tarefas = Vec::new();
    for ws in &eu.data.workspaces {
        let base = format!(
            "{API}/tasks?assignee={}&workspace={}&completed_since=now&limit=100\
             &opt_fields=name,due_on,permalink_url,parent.name,modified_at",
            eu.data.gid, ws.gid
        );
        let mut url = base.clone();
        loop {
            let r: Resposta<Vec<Tarefa>> = get(token, &url)?;
            tarefas.extend(r.data);
            match r.next_page {
                Some(p) => url = format!("{base}&offset={}", p.offset),
                None => break,
            }
        }
    }
    Ok(tarefas)
}

/// Estado que sobrevive entre as consultas, para não repetir alertas.
#[derive(Default)]
pub struct Memoria {
    vistas: HashSet<String>,
    alteradas: std::collections::HashMap<String, String>,
    primeira_feita: bool,
    resumo_do_dia: Option<NaiveDate>,
    sugestao_revisar: Option<NaiveDate>,
}

fn dia_semana(d: NaiveDate) -> &'static str {
    ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"][d.weekday().num_days_from_monday() as usize]
}

pub fn avaliar(tarefas: &[Tarefa], mem: &mut Memoria, cfg: &Config) -> (Painel, Vec<Alerta>) {
    let hoje = Local::now().date_naive();
    let mut antigas = 0usize;
    let mut atrasadas = Vec::new();
    let mut de_hoje = Vec::new();
    let mut semana = Vec::new();

    for t in tarefas.iter().filter(|t| !cfg.asana_ocultas.contains(&t.gid)) {
        let Some(data) = t.due_on.as_deref().and_then(|d| NaiveDate::parse_from_str(d, "%Y-%m-%d").ok()) else {
            continue;
        };
        let dias = (data - hoje).num_days();
        let titulo = match &t.parent {
            Some(p) => format!("{} · {}", t.name, p.name.as_deref().unwrap_or("")),
            None => t.name.clone(),
        };
        let item = |detalhe: String, atencao: bool| Item {
            link: t.permalink_url.clone(),
            id: Some(t.gid.clone()),
            ..Item::novo(titulo.clone(), detalhe, atencao)
        };
        if dias < -cfg.asana_dias_antiga {
            antigas += 1;
        } else if dias < 0 {
            atrasadas.push((dias, item(format!("atrasada {}d", -dias), true)));
        } else if dias == 0 {
            de_hoje.push((0, item("hoje".into(), true)));
        } else if dias <= 7 {
            semana.push((dias, item(format!("{} {}", dia_semana(data), data.format("%d/%m")), false)));
        }
    }
    atrasadas.sort_by_key(|(d, _)| *d);
    semana.sort_by_key(|(d, _)| *d);

    let mut alertas = Vec::new();

    // Tarefa nova atribuída desde a última consulta.
    let novas: Vec<&Tarefa> = tarefas.iter().filter(|t| !mem.vistas.contains(&t.gid)).collect();
    if mem.primeira_feita {
        match novas.as_slice() {
            [] => {}
            [t] => alertas.push(Alerta { fonte: "asana", texto: format!("Tarefa nova pra você: {}", t.name) }),
            v => alertas.push(Alerta { fonte: "asana", texto: format!("{} tarefas novas pra você no Asana.", v.len()) }),
        }
    }
    // Tarefa já conhecida que mudou (comentário, prazo, descrição), por alguém ou por mim.
    if mem.primeira_feita {
        let mudaram: Vec<&Tarefa> = tarefas
            .iter()
            .filter(|t| mem.vistas.contains(&t.gid))
            .filter(|t| match (mem.alteradas.get(&t.gid), &t.modified_at) {
                (Some(antes), Some(agora)) => antes != agora,
                _ => false,
            })
            .collect();
        match mudaram.as_slice() {
            [] => {}
            [t] => alertas.push(Alerta { fonte: "asana", texto: format!("Atualizaram a tarefa: {}", t.name) }),
            v => alertas.push(Alerta { fonte: "asana", texto: format!("{} tarefas suas foram atualizadas no Asana.", v.len()) }),
        }
    }
    mem.alteradas = tarefas.iter().filter_map(|t| Some((t.gid.clone(), t.modified_at.clone()?))).collect();
    mem.vistas = tarefas.iter().map(|t| t.gid.clone()).collect();
    mem.primeira_feita = true;

    // Resumo uma vez por dia, a partir da hora escolhida.
    let agora = Local::now();
    let hora_resumo = chrono::NaiveTime::from_hms_opt(cfg.asana_hora_resumo.min(23), 0, 0).unwrap();
    if mem.resumo_do_dia != Some(hoje) && agora.time() >= hora_resumo {
        mem.resumo_do_dia = Some(hoje);
        let (a, h) = (atrasadas.len(), de_hoje.len());
        let texto = match (a, h) {
            (0, 0) => None,
            (0, h) => Some(format!("Bom dia! {h} tarefa(s) vencem hoje.")),
            (a, 0) => Some(format!("Bom dia! {a} tarefa(s) atrasada(s) no Asana.")),
            (a, h) => Some(format!("Bom dia! {a} atrasada(s) e {h} pra hoje no Asana.")),
        };
        if let Some(texto) = texto {
            alertas.push(Alerta { fonte: "asana", texto });
        }
    }

    // Muita coisa atrasada há semanas: sugere revisar o projeto, no máximo uma vez por semana.
    if antigas > 0 && mem.sugestao_revisar.map_or(true, |d| (hoje - d).num_days() >= 7) {
        mem.sugestao_revisar = Some(hoje);
        alertas.push(Alerta {
            fonte: "asana",
            texto: format!(
                "{antigas} tarefa(s) atrasadas há mais de {} dias. Que tal revisar o VM Gestão e arquivar o que já não vale?",
                cfg.asana_dias_antiga
            ),
        });
    }

    let numero = atrasadas.len() + de_hoje.len();
    let nivel = if !atrasadas.is_empty() { Nivel::Atencao } else { Nivel::Ok };
    let mut itens: Vec<Item> = atrasadas.into_iter().chain(de_hoje).chain(semana).map(|(_, i)| i).collect();
    if antigas > 0 {
        itens.push(Item {
            link: Some("https://app.asana.com/0/1209752058160384/list".into()),
            ..Item::novo(
                format!("{antigas} tarefa(s) atrasadas há mais de {} dias: considere atualizar ou arquivar", cfg.asana_dias_antiga),
                "revisar",
                false,
            )
        });
    }
    (
        Painel { fonte: "asana", nivel, numero: numero.to_string(), itens, vazio: "Nada atrasado nem pra esta semana.".into() },
        alertas,
    )
}

pub fn painel_erro(msg: &str) -> Painel {
    Painel { fonte: "asana", nivel: Nivel::Nenhum, numero: "!".into(), itens: vec![], vazio: format!("Asana: {msg}.") }
}

pub fn painel_sem_token() -> Painel {
    Painel { fonte: "asana", nivel: Nivel::Nenhum, numero: "–".into(), itens: vec![], vazio: String::new() }
}

#[cfg(test)]
mod testes {
    use super::*;

    fn t(gid: &str, dias: i64) -> Tarefa {
        let d = Local::now().date_naive() + chrono::Duration::days(dias);
        Tarefa { gid: gid.into(), name: format!("tarefa {gid}"), due_on: Some(d.to_string()), permalink_url: None, parent: None, modified_at: Some("1".into()) }
    }

    #[test]
    fn separa_atrasadas_hoje_e_semana() {
        let mut mem = Memoria::default();
        let (p, a) = avaliar(&[t("1", -2), t("2", 0), t("3", 3), t("4", 20), t("5", -90)], &mut mem, &Config::default());
        assert_eq!(p.numero, "2");
        assert!(a.iter().any(|x| x.texto.contains("revisar")));
        assert!(p.itens.last().unwrap().titulo.contains("arquivar"));
        assert!(matches!(p.nivel, Nivel::Atencao));
        let detalhes: Vec<_> = p.itens.iter().map(|i| i.detalhe.as_str()).collect();
        assert_eq!(detalhes[0], "atrasada 2d");
        assert_eq!(detalhes[1], "hoje");
        assert_eq!(p.itens.len(), 4);
    }

    #[test]
    fn avisa_tarefa_nova_so_depois_da_primeira_consulta() {
        let mut mem = Memoria::default();
        mem.resumo_do_dia = Some(Local::now().date_naive());
        let (_, a) = avaliar(&[t("1", 3)], &mut mem, &Config::default());
        assert!(a.is_empty());
        let (_, a) = avaliar(&[t("1", 3), t("2", 5)], &mut mem, &Config::default());
        assert_eq!(a.len(), 1);
        assert!(a[0].texto.contains("tarefa 2"));
        let (_, a) = avaliar(&[t("1", 3), t("2", 5)], &mut mem, &Config::default());
        assert!(a.is_empty());
        let mut mudou = t("2", 5);
        mudou.modified_at = Some("2".into());
        let (_, a) = avaliar(&[t("1", 3), mudou], &mut mem, &Config::default());
        assert_eq!(a.len(), 1);
        assert!(a[0].texto.contains("Atualizaram"));
    }
}
