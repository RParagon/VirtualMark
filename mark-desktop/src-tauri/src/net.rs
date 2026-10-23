use std::net::{SocketAddr, ToSocketAddrs};
use std::sync::OnceLock;
use std::time::Duration;

// Um cliente HTTP só para o app. Tenta IPv4 antes de IPv6 (no PC do Rafael o IPv6 não
// funciona e o Google Ads estourava o tempo) e o tempo de conexão por endereço é curto.

fn ipv4_primeiro(endereco: &str) -> std::io::Result<Vec<SocketAddr>> {
    let mut v: Vec<SocketAddr> = endereco.to_socket_addrs()?.collect();
    v.sort_by_key(|a| a.is_ipv6());
    Ok(v)
}

pub fn agente() -> &'static ureq::Agent {
    static AGENTE: OnceLock<ureq::Agent> = OnceLock::new();
    AGENTE.get_or_init(|| {
        ureq::AgentBuilder::new()
            .resolver(ipv4_primeiro)
            .timeout_connect(Duration::from_secs(5))
            .timeout_read(Duration::from_secs(60))
            .timeout_write(Duration::from_secs(20))
            .user_agent("Mark-VirtualMark/0.2")
            .build()
    })
}

/// Repete uma vez quando a falha é de rede (não quando o servidor respondeu com erro).
pub fn com_retentativa<T>(mut f: impl FnMut() -> Result<T, ureq::Error>) -> Result<T, ureq::Error> {
    match f() {
        Err(ureq::Error::Transport(_)) => {
            std::thread::sleep(Duration::from_secs(2));
            f()
        }
        r => r,
    }
}

/// Mensagem curta para a barra, sem URL nem texto técnico do Windows.
pub fn explicar(e: &ureq::Error) -> String {
    match e {
        ureq::Error::Status(c, _) => format!("o servidor respondeu {c}"),
        ureq::Error::Transport(t) => match t.kind() {
            ureq::ErrorKind::Dns => "sem conexão com a internet (DNS)".into(),
            ureq::ErrorKind::ConnectionFailed => "não consegui conectar (rede ou firewall)".into(),
            ureq::ErrorKind::Io => "a conexão caiu ou demorou demais".into(),
            _ => "falha de rede".into(),
        },
    }
}
