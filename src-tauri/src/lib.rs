use std::sync::Mutex;

use tauri::{
    image::Image,
    include_image,
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, WebviewWindowBuilder,
};

mod app;
use app::commands::{log, set_toggle_shortcut};
use app::event::start_listener;
use app::state::{AppState, KeyEventStore};
use tauri_plugin_store::StoreExt;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle();

            let mut app_state = AppState::new();

            // load toggleShortcut from store if it exists
            let store = app.store("store.json")?;
            if let Some(value) = store.get("key_event_store") {
                // the value comes in as a String: "{\"state\": ...}"
                if let Some(json_str) = value.as_str() {
                    // parse the inner string
                    match serde_json::from_str::<KeyEventStore>(json_str) {
                        Ok(parsed) => {
                            app_state.toggle_shortcut = parsed.state.toggle_shortcut;
                        }
                        Err(e) => eprintln!("Failed to parse inner config JSON: {}", e),
                    }
                }
            }

            // manage app state
            app.manage(Mutex::new(app_state));

            // tray actions
            let toggle_item = MenuItem::with_id(app, "toggle", "Stop", true, None::<&str>)?;
            let settings_item = MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

            // start global input listener
            start_listener(app_handle.clone(), toggle_item.clone());

            // setup tray menu
            let tray_icon = Image::from(include_image!("icons/tray.png"));
            let menu = Menu::with_items(app, &[&toggle_item, &settings_item, &quit_item])?;
            let _ = TrayIconBuilder::with_id("keyviz-tray")
                .icon(tray_icon.clone())
                .menu(&menu)
                .show_menu_on_left_click(true)
                .on_menu_event(move |app, event| match event.id.as_ref() {
                    "toggle" => {
                        let state = app.state::<Mutex<AppState>>();
                        let mut app_state = state.lock().unwrap();

                        app_state.listening = !app_state.listening;

                        if app_state.listening {
                            println!("🟢 Listening enabled via tray menu.");
                            toggle_item.set_text("Stop").unwrap();
                            app.tray_by_id("keyviz-tray")
                                .unwrap()
                                .set_icon(Some(tray_icon.clone()))
                                .unwrap();
                        } else {
                            println!("🔴 Listening disabled via tray menu.");
                            toggle_item.set_text("Start").unwrap();
                            app.tray_by_id("keyviz-tray")
                                .unwrap()
                                .set_icon(Some(Image::from(include_image!(
                                    "icons/tray-disabled.png"
                                ))))
                                .unwrap();
                        }
                    }
                    "settings" => {
                        let webview_url = tauri::WebviewUrl::App("index.html#/settings".into());
                        WebviewWindowBuilder::new(app, "settings", webview_url.clone())
                            .title("Settings")
                            .inner_size(800.0, 640.0)
                            .min_inner_size(560.0, 480.0)
                            .max_inner_size(1000.0, 800.0)
                            .maximizable(false)
                            .always_on_top(true)
                            .build()
                            .unwrap();
                    }
                    "quit" => std::process::exit(0),
                    _ => println!("um... what?"),
                })
                .build(app);

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![log, set_toggle_shortcut])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
