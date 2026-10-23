use serde::Serialize;

// Mesmo formato que a barra (src/ilha.ts) desenha.

#[derive(Serialize, Clone, Debug)]
pub struct Item {
    pub titulo: String,
    pub detalhe: String,
    pub atencao: bool,
    pub link: Option<String>,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "lowercase")]
pub enum Nivel {
    Nenhum,
    Ok,
    Trabalhando,
    Atencao,
}

#[derive(Serialize, Clone, Debug)]
pub struct Painel {
    pub fonte: &'static str,
    pub nivel: Nivel,
    pub numero: String,
    pub itens: Vec<Item>,
    pub vazio: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct Alerta {
    pub fonte: &'static str,
    pub texto: String,
}
