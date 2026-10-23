use serde::Serialize;
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::TrayIconBuilder,
    AppHandle, Emitter, Manager, PhysicalPosition, WebviewWindow,
};

// Tamanhos lógicos das janelas (iguais aos de tauri.conf.json).
const ILHA_LARGURA: f64 = 440.0;
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
        let iw = (ILHA_LARGURA * e) as i32;
        let _ = ilha.set_position(PhysicalPosition::new(ax + (aw - iw) / 2, ay + (6.0 * e) as i32));
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
        .invoke_handler(tauri::generate_handler![area_trabalho])
        .setup(|app| {
            posicionar(app.handle());

            let demo = MenuItem::with_id(app, "demo", "Testar animações", true, None::<&str>)?;
            let teste = MenuItem::with_id(app, "alerta-teste", "Testar um alerta", true, None::<&str>)?;
            let pausar = MenuItem::with_id(app, "pausar", "Pausar alertas por 1 hora", true, None::<&str>)?;
            let sep = PredefinedMenuItem::separator(app)?;
            let sair = MenuItem::with_id(app, "sair", "Sair", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&demo, &teste, &pausar, &sep, &sair])?;

            let mut bandeja = TrayIconBuilder::with_id("mark")
                .tooltip("Mark")
                .menu(&menu)
                .on_menu_event(|app, ev| match ev.id().as_ref() {
                    "sair" => app.exit(0),
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
