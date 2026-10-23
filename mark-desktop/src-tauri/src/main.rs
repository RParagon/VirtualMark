// Sem janela de console no Windows em release.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Chamado pelos hooks do Claude Code: só repassa o evento e sai.
    if std::env::args().any(|a| a == mark_desktop_lib::FLAG_HOOK) {
        mark_desktop_lib::rele_hook();
        return;
    }
    mark_desktop_lib::run()
}
