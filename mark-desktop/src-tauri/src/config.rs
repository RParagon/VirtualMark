use std::path::PathBuf;
use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

// Preferências editáveis na tela de Configurações, gravadas em config.json na pasta do app.

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(default)]
pub struct Config {
    pub tema: String,
    pub intervalo_asana_min: u64,
    pub intervalo_ads_min: u64,
    /// Atrasadas há mais que isso saem da contagem e viram um aviso para revisar o projeto.
    pub asana_dias_antiga: i64,
    pub asana_hora_resumo: u32,
    pub ads_hora_sem_impressoes: u32,
    pub ads_gasto_sobre_orcamento_pct: f64,
    pub ads_cpa_sobe_pct: f64,
    pub ads_cpa_min_conversoes: f64,
    pub ads_env: String,
    /// Segundos parada até a barra se recolher no topo (0 = nunca).
    pub ilha_recolher_seg: u64,
    /// Tarefas do Asana que o Rafael escondeu da barra.
    pub asana_ocultas: Vec<String>,
}

impl Default for Config {
    fn default() -> Self {
        Config {
            tema: "escuro".into(),
            intervalo_asana_min: 5,
            intervalo_ads_min: 30,
            asana_dias_antiga: 30,
            asana_hora_resumo: 8,
            ads_hora_sem_impressoes: 11,
            ads_gasto_sobre_orcamento_pct: 120.0,
            ads_cpa_sobe_pct: 40.0,
            ads_cpa_min_conversoes: 10.0,
            ads_env: crate::ads::ENV_PADRAO.into(),
            ilha_recolher_seg: 20,
            asana_ocultas: Vec::new(),
        }
    }
}

pub struct Preferencias(pub Mutex<Config>);

fn arquivo(app: &AppHandle) -> Option<PathBuf> {
    app.path().app_config_dir().ok().map(|d| d.join("config.json"))
}

pub fn carregar(app: &AppHandle) -> Config {
    arquivo(app)
        .and_then(|p| std::fs::read_to_string(p).ok())
        .and_then(|t| serde_json::from_str(&t).ok())
        .unwrap_or_default()
}

pub fn salvar(app: &AppHandle, cfg: &Config) -> Result<(), String> {
    let p = arquivo(app).ok_or("pasta de configuração não encontrada")?;
    if let Some(d) = p.parent() {
        std::fs::create_dir_all(d).map_err(|e| e.to_string())?;
    }
    std::fs::write(p, serde_json::to_string_pretty(cfg).unwrap()).map_err(|e| e.to_string())
}

pub fn atual(app: &AppHandle) -> Config {
    app.state::<Preferencias>().0.lock().unwrap().clone()
}
