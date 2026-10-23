use serde::Serialize;

// Mesmo formato que a barra (src/ilha.ts) desenha.

#[derive(Serialize, Clone, Debug)]
pub struct Item {
    pub titulo: String,
    pub detalhe: String,
    pub atencao: bool,
    pub link: Option<String>,
    /// Segunda linha, mais apagada (ex.: ferramenta que o Claude está usando).
    pub sub: Option<String>,
    /// Momento de referência (epoch em ms); a barra mostra "há 3 min".
    pub desde_ms: Option<i64>,
    /// Id no serviço de origem, para ações (concluir tarefa no Asana).
    pub id: Option<String>,
}

impl Item {
    pub fn novo(titulo: impl Into<String>, detalhe: impl Into<String>, atencao: bool) -> Self {
        Item { titulo: titulo.into(), detalhe: detalhe.into(), atencao, link: None, sub: None, desde_ms: None, id: None }
    }
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
