// Tokens guardados no Gerenciador de Credenciais do Windows, nunca em arquivo.

const SERVICO: &str = "br.com.virtualmark.mark";

pub fn ler(nome: &str) -> Option<String> {
    keyring::Entry::new(SERVICO, nome).ok()?.get_password().ok().filter(|s| !s.trim().is_empty())
}

pub fn gravar(nome: &str, valor: &str) -> Result<(), String> {
    let entrada = keyring::Entry::new(SERVICO, nome).map_err(|e| e.to_string())?;
    if valor.trim().is_empty() {
        let _ = entrada.delete_credential();
        Ok(())
    } else {
        entrada.set_password(valor.trim()).map_err(|e| e.to_string())
    }
}
