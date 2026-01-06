use std::sync::Mutex;

use tauri::{Manager, PhysicalPosition, PhysicalSize};

use crate::app::state::AppState;

#[tauri::command]
pub fn log(message: String) {
    println!("[LOG] {}", message);
}

#[tauri::command]
pub fn set_toggle_shortcut(app: tauri::AppHandle, shortcut: Vec<String>) {
    let state = app.state::<Mutex<AppState>>();
    let mut app_state = state.lock().unwrap();
    app_state.toggle_shortcut = shortcut;
}

#[tauri::command]
pub fn set_main_window_monitor(app: tauri::AppHandle, monitor_name: String) {
    if let Some(window) = app.get_webview_window("main") {
        let monitors = window.available_monitors().unwrap_or_default();

        let target_monitor = monitors
            .iter()
            .find(|m| m.name() == Some(&monitor_name));

        if let Some(monitor) = target_monitor {
            let position = monitor.position();
            let size = monitor.size();
            window.set_position(PhysicalPosition { x: position.x, y: position.y }).unwrap_or(());
            window.set_size(PhysicalSize { width: size.width, height: size.height }).unwrap_or(());
            println!(
                "[INFO] Moved main window to monitor: {} at position ({}, {})",
                monitor_name, position.x, position.y
            );
        }
    }
}
