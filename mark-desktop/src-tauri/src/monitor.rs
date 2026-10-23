use std::collections::HashMap;
use std::sync::mpsc::{channel, RecvTimeoutError, Sender};
use std::sync::Mutex;
use std::time::{Duration, Instant};

use tauri::{AppHandle, Emitter, Manager};

use crate::painel::Painel;
use crate::{ads, asana, cofre, config};

// Uma thread só, que acorda a cada minuto, roda cada integração no seu intervalo
// e avisa a barra pelos eventos "status" e "regra:alerta".

pub const TOKEN_ASANA: &str = "asana_token";

pub struct Monitor {
    pub paineis: Mutex<HashMap<&'static str, Painel>>,
    acordar: Mutex<Sender<()>>,
}

impl Monitor {
    pub fn atualizar_agora(&self) {
        let _ = self.acordar.lock().unwrap().send(());
    }
}

fn publicar(app: &AppHandle, painel: Painel) {
    let _ = app.emit("status", &painel);
    app.state::<Monitor>().paineis.lock().unwrap().insert(painel.fonte, painel);
}

pub fn iniciar(app: &AppHandle) {
    let (tx, rx) = channel::<()>();
    app.manage(Monitor { paineis: Mutex::new(HashMap::new()), acordar: Mutex::new(tx) });

    let app = app.clone();
    std::thread::spawn(move || {
        let mut mem_asana = asana::Memoria::default();
        let mut proxima_asana = Instant::now();
        let mut mem_ads = ads::Memoria::default();
        let mut proxima_ads = Instant::now();
        loop {
            let agora = Instant::now();
            let cfg = config::atual(&app);
            if agora >= proxima_asana {
                proxima_asana = agora + Duration::from_secs(cfg.intervalo_asana_min.max(1) * 60);
                match cofre::ler(TOKEN_ASANA) {
                    None => publicar(&app, asana::painel_sem_token()),
                    Some(token) => match asana::buscar(&token) {
                        Ok(tarefas) => {
                            let (painel, alertas) = asana::avaliar(&tarefas, &mut mem_asana, &cfg);
                            publicar(&app, painel);
                            for a in alertas {
                                let _ = app.emit("regra:alerta", &a);
                            }
                        }
                        Err(e) => publicar(&app, asana::painel_erro(&e)),
                    },
                }
            }
            if agora >= proxima_ads {
                proxima_ads = agora + Duration::from_secs(cfg.intervalo_ads_min.max(5) * 60);
                if !ads::conectado() {
                    publicar(&app, ads::painel_sem_credenciais());
                } else {
                    match ads::buscar() {
                        Ok(contas) => {
                            let (painel, alertas) = ads::avaliar(&contas, &mut mem_ads, &cfg);
                            publicar(&app, painel);
                            for a in alertas {
                                let _ = app.emit("regra:alerta", &a);
                            }
                        }
                        Err(e) => publicar(&app, ads::painel_erro(&e)),
                    }
                }
            }
            match rx.recv_timeout(Duration::from_secs(60)) {
                Ok(()) => {
                    proxima_asana = Instant::now();
                    proxima_ads = Instant::now();
                }
                Err(RecvTimeoutError::Timeout) => {}
                Err(RecvTimeoutError::Disconnected) => break,
            }
        }
    });
}
