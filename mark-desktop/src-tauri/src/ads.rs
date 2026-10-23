use std::collections::{HashMap, HashSet};

use chrono::{Local, NaiveDate, Timelike};
use serde_json::{json, Value};

use crate::cofre;
use crate::painel::{Alerta, Item, Nivel, Painel};

// Google Ads pela MCC, só leitura. Mesmas credenciais do E:\Paragon\analise-cpa\.env,
// importadas uma vez para o Gerenciador de Credenciais do Windows.

pub const CHAVES: [(&str, &str); 5] = [
    ("GOOGLE_ADS_CLIENT_ID", "ads_client_id"),
    ("GOOGLE_ADS_CLIENT_SECRET", "ads_client_secret"),
    ("GOOGLE_ADS_REFRESH_TOKEN", "ads_refresh_token"),
    ("GOOGLE_ADS_DEVELOPER_TOKEN", "ads_developer_token"),
    ("GOOGLE_ADS_MCC_ID", "ads_mcc_id"),
];
pub const ENV_PADRAO: &str = r"E:\Paragon\analise-cpa\.env";

// Regras (ajustar aqui até existir uma tela de configuração).
const HORA_SEM_IMPRESSOES: u32 = 11; // depois desta hora, conta ativa com 0 impressões vira alerta
const GASTO_SOBRE_ORCAMENTO: f64 = 1.2; // gasto do dia acima de 120% da soma dos orçamentos
const CPA_SOBE: f64 = 1.4; // CPA dos últimos 3 dias 40% acima do de 30 dias
const CPA_MIN_CONVERSOES: f64 = 10.0; // só compara CPA com amostra mínima

struct Credenciais {
    client_id: String,
    client_secret: String,
    refresh_token: String,
    developer_token: String,
    mcc: String,
}

fn credenciais() -> Option<Credenciais> {
    Some(Credenciais {
        client_id: cofre::ler("ads_client_id")?,
        client_secret: cofre::ler("ads_client_secret")?,
        refresh_token: cofre::ler("ads_refresh_token")?,
        developer_token: cofre::ler("ads_developer_token")?,
        mcc: cofre::ler("ads_mcc_id")?.replace('-', ""),
    })
}

pub fn conectado() -> bool {
    credenciais().is_some()
}

/// Lê o .env do analise-cpa e guarda as 5 chaves no cofre.
pub fn importar_env(caminho: &str) -> Result<(), String> {
    let texto = std::fs::read_to_string(caminho).map_err(|e| format!("não consegui ler {caminho}: {e}"))?;
    let mut achadas = HashMap::new();
    for linha in texto.lines() {
        let l = linha.trim();
        if l.starts_with('#') {
            continue;
        }
        if let Some((k, v)) = l.split_once('=') {
            achadas.insert(k.trim().to_string(), v.trim().trim_matches('"').to_string());
        }
    }
    for (env, _) in CHAVES {
        if achadas.get(env).map_or(true, |v| v.is_empty()) {
            return Err(format!("falta {env} no .env"));
        }
    }
    for (env, nome) in CHAVES {
        cofre::gravar(nome, &achadas[env])?;
    }
    Ok(())
}

struct Cliente {
    cred: Credenciais,
    token: String,
    versao: Option<&'static str>,
}

const VERSOES: [&str; 5] = ["v24", "v23", "v22", "v21", "v20"];

impl Cliente {
    fn novo(cred: Credenciais) -> Result<Self, String> {
        let r: Value = ureq::post("https://oauth2.googleapis.com/token")
            .send_form(&[
                ("client_id", cred.client_id.as_str()),
                ("client_secret", cred.client_secret.as_str()),
                ("refresh_token", cred.refresh_token.as_str()),
                ("grant_type", "refresh_token"),
            ])
            .map_err(|e| format!("login no Google falhou ({e})"))?
            .into_json()
            .map_err(|e| e.to_string())?;
        let token = r["access_token"].as_str().ok_or("login no Google sem token")?.to_string();
        Ok(Cliente { cred, token, versao: None })
    }

    fn consulta(&mut self, conta: &str, gaql: &str) -> Result<Vec<Value>, String> {
        let versoes: Vec<&'static str> = match self.versao {
            Some(v) => vec![v],
            None => VERSOES.to_vec(),
        };
        for v in versoes {
            let url = format!("https://googleads.googleapis.com/{v}/customers/{conta}/googleAds:searchStream");
            let r = ureq::post(&url)
                .set("Authorization", &format!("Bearer {}", self.token))
                .set("developer-token", &self.cred.developer_token)
                .set("login-customer-id", &self.cred.mcc)
                .timeout(std::time::Duration::from_secs(30))
                .send_json(json!({ "query": gaql }));
            match r {
                Ok(resp) => {
                    self.versao = Some(v);
                    let lotes: Vec<Value> = resp.into_json().map_err(|e| e.to_string())?;
                    return Ok(lotes
                        .into_iter()
                        .flat_map(|b| b["results"].as_array().cloned().unwrap_or_default())
                        .collect());
                }
                Err(ureq::Error::Status(404, _)) if self.versao.is_none() => continue,
                Err(ureq::Error::Status(c, resp)) => {
                    let corpo = resp.into_string().unwrap_or_default();
                    return Err(format!("Google Ads respondeu {c}: {}", corpo.chars().take(200).collect::<String>()));
                }
                Err(e) => return Err(e.to_string()),
            }
        }
        Err("nenhuma versão da API do Google Ads respondeu".into())
    }
}

fn num(v: &Value) -> f64 {
    match v {
        Value::String(s) => s.parse().unwrap_or(0.0),
        Value::Number(n) => n.as_f64().unwrap_or(0.0),
        _ => 0.0,
    }
}

fn reais(v: f64) -> String {
    format!("R$ {:.0}", v)
}

/// Números de uma conta numa rodada.
pub struct Conta {
    id: String,
    nome: String,
    gasto_hoje: f64,
    impressoes_hoje: f64,
    orcamento: f64,
    reprovados: usize,
    cpa_3d: Option<f64>,
    cpa_30d: Option<f64>,
    conv_30d: f64,
}

pub fn buscar() -> Result<Vec<Conta>, String> {
    let cred = credenciais().ok_or("credenciais não importadas")?;
    let mcc = cred.mcc.clone();
    let mut c = Cliente::novo(cred)?;
    let clientes = c.consulta(
        &mcc,
        "SELECT customer_client.id, customer_client.descriptive_name FROM customer_client \
         WHERE customer_client.manager = false AND customer_client.status = 'ENABLED'",
    )?;
    let hoje = Local::now().date_naive();
    let mut contas = Vec::new();
    for cl in clientes {
        let id = cl["customerClient"]["id"].as_str().unwrap_or_default().to_string();
        let nome = cl["customerClient"]["descriptiveName"].as_str().unwrap_or(&id).to_string();

        // 30 dias por dia: serve para ignorar contas paradas e para o CPA.
        let dias = c.consulta(
            &id,
            "SELECT segments.date, metrics.cost_micros, metrics.conversions FROM customer \
             WHERE segments.date DURING LAST_30_DAYS",
        )?;
        let mut gasto30 = 0.0;
        let (mut g3, mut c3, mut conv30) = (0.0, 0.0, 0.0);
        for d in &dias {
            let g = num(&d["metrics"]["costMicros"]) / 1e6;
            let cv = num(&d["metrics"]["conversions"]);
            gasto30 += g;
            conv30 += cv;
            if let Some(data) = d["segments"]["date"].as_str().and_then(|s| NaiveDate::parse_from_str(s, "%Y-%m-%d").ok()) {
                if (hoje - data).num_days() <= 3 {
                    g3 += g;
                    c3 += cv;
                }
            }
        }
        if gasto30 == 0.0 {
            continue;
        }

        let hoje_r = c.consulta(
            &id,
            "SELECT metrics.cost_micros, metrics.impressions FROM customer WHERE segments.date DURING TODAY",
        )?;
        let gasto_hoje = hoje_r.iter().map(|r| num(&r["metrics"]["costMicros"])).sum::<f64>() / 1e6;
        let impressoes_hoje = hoje_r.iter().map(|r| num(&r["metrics"]["impressions"])).sum::<f64>();

        let orc = c.consulta(
            &id,
            "SELECT campaign_budget.resource_name, campaign_budget.amount_micros FROM campaign \
             WHERE campaign.status = 'ENABLED'",
        )?;
        let mut vistos = HashSet::new();
        let orcamento = orc
            .iter()
            .filter(|r| vistos.insert(r["campaignBudget"]["resourceName"].as_str().unwrap_or_default().to_string()))
            .map(|r| num(&r["campaignBudget"]["amountMicros"]))
            .sum::<f64>()
            / 1e6;

        let reprovados = c
            .consulta(
                &id,
                "SELECT ad_group_ad.ad.id FROM ad_group_ad \
                 WHERE ad_group_ad.policy_summary.approval_status = 'DISAPPROVED' \
                 AND ad_group_ad.status = 'ENABLED' AND campaign.status = 'ENABLED'",
            )?
            .len();

        contas.push(Conta {
            id,
            nome,
            gasto_hoje,
            impressoes_hoje,
            orcamento,
            reprovados,
            cpa_3d: (c3 > 0.0).then(|| g3 / c3),
            cpa_30d: (conv30 > 0.0).then(|| gasto30 / conv30),
            conv_30d: conv30,
        });
    }
    Ok(contas)
}

/// Alertas já dados hoje, por conta e regra.
#[derive(Default)]
pub struct Memoria {
    dia: Option<NaiveDate>,
    avisados: HashSet<(String, &'static str)>,
}

pub fn avaliar(contas: &[Conta], mem: &mut Memoria) -> (Painel, Vec<Alerta>) {
    let agora = Local::now();
    if mem.dia != Some(agora.date_naive()) {
        mem.dia = Some(agora.date_naive());
        mem.avisados.clear();
    }
    let mut alertas = Vec::new();
    let mut itens = Vec::new();
    let mut com_problema = 0;

    for c in contas {
        let mut problemas: Vec<(&'static str, String)> = Vec::new();
        if c.orcamento > 0.0 && c.impressoes_hoje == 0.0 && agora.hour() >= HORA_SEM_IMPRESSOES {
            problemas.push(("sem_impressoes", format!("{} está sem impressões hoje.", c.nome)));
        }
        if c.orcamento > 0.0 && c.gasto_hoje > c.orcamento * GASTO_SOBRE_ORCAMENTO {
            problemas.push((
                "gasto",
                format!("{} já gastou {} hoje, acima do orçamento de {}.", c.nome, reais(c.gasto_hoje), reais(c.orcamento)),
            ));
        }
        if c.reprovados > 0 {
            problemas.push(("reprovados", format!("{} tem {} anúncio(s) reprovado(s).", c.nome, c.reprovados)));
        }
        if let (Some(c3), Some(c30)) = (c.cpa_3d, c.cpa_30d) {
            if c.conv_30d >= CPA_MIN_CONVERSOES && c3 > c30 * CPA_SOBE {
                problemas.push((
                    "cpa",
                    format!("CPA da {} subiu: {} nos últimos 3 dias contra {} no mês.", c.nome, reais(c3), reais(c30)),
                ));
            }
        }

        if !problemas.is_empty() {
            com_problema += 1;
        }
        for (regra, texto) in &problemas {
            if mem.avisados.insert((c.id.clone(), regra)) {
                alertas.push(Alerta { fonte: "ads", texto: texto.clone() });
            }
        }
        let mut detalhe = format!("{} hoje", reais(c.gasto_hoje));
        if let Some(cpa) = c.cpa_3d {
            detalhe.push_str(&format!(" · CPA {}", reais(cpa)));
        }
        itens.push((
            !problemas.is_empty(),
            Item {
                titulo: match problemas.first() {
                    Some((_, t)) => t.clone(),
                    None => c.nome.clone(),
                },
                detalhe,
                atencao: !problemas.is_empty(),
                link: Some("https://ads.google.com/aw/overview".into()),
            },
        ));
    }
    itens.sort_by_key(|(p, _)| !*p);
    let nivel = if com_problema > 0 { Nivel::Atencao } else { Nivel::Ok };
    (
        Painel {
            fonte: "ads",
            nivel,
            numero: com_problema.to_string(),
            itens: itens.into_iter().map(|(_, i)| i).collect(),
            vazio: "Nenhuma conta com gasto nos últimos 30 dias.".into(),
        },
        alertas,
    )
}

pub fn painel_erro(msg: &str) -> Painel {
    Painel { fonte: "ads", nivel: Nivel::Nenhum, numero: "!".into(), itens: vec![], vazio: format!("Google Ads: {msg}.") }
}

pub fn painel_sem_credenciais() -> Painel {
    Painel { fonte: "ads", nivel: Nivel::Nenhum, numero: "–".into(), itens: vec![], vazio: String::new() }
}

#[cfg(test)]
mod testes {
    use super::*;

    fn conta(id: &str) -> Conta {
        Conta {
            id: id.into(),
            nome: format!("Conta {id}"),
            gasto_hoje: 50.0,
            impressoes_hoje: 100.0,
            orcamento: 100.0,
            reprovados: 0,
            cpa_3d: Some(20.0),
            cpa_30d: Some(18.0),
            conv_30d: 40.0,
        }
    }

    #[test]
    fn conta_saudavel_nao_alerta() {
        let (p, a) = avaliar(&[conta("1")], &mut Memoria::default());
        assert!(a.is_empty());
        assert_eq!(p.numero, "0");
    }

    #[test]
    fn regras_disparam_uma_vez_por_dia() {
        let mut c = conta("1");
        c.gasto_hoje = 130.0;
        c.reprovados = 2;
        c.cpa_3d = Some(30.0);
        let mut mem = Memoria::default();
        let (p, a) = avaliar(&[c], &mut mem);
        assert_eq!(a.len(), 3);
        assert_eq!(p.numero, "1");
        assert!(p.itens[0].atencao);
        let mut c = conta("1");
        c.gasto_hoje = 130.0;
        let (_, a) = avaliar(&[c], &mut mem);
        assert!(a.is_empty());
    }
}
