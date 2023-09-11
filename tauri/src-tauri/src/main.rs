// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
use error::{Error, Result};

mod api;
mod config;
mod upload;
use config::Config;
use std::path::PathBuf;

#[tauri::command]
async fn scan(app_handle: tauri::AppHandle, files: Vec<&str>) -> Result<Vec<PathBuf>> {
    let config_path = match app_handle.path_resolver().app_config_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let config_file = config_path.join("config/app.conf");
    let config = config::Config::from(config_file)?;
    api::get_user(&config).await?;

    let files = upload::resolve(files)?;
    let paths = files.clone();
    Ok(paths)
}

#[tauri::command]
async fn upload(
    app_handle: tauri::AppHandle,
    file: &str,
    name: Option<&str>,
) -> Result<Option<String>> {
    let config_path = match app_handle.path_resolver().app_config_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let config_file = config_path.join("config/app.conf");
    let config = config::Config::from(config_file)?;
    let label = match name {
        Some(s) => Some(s.to_owned()),
        None => None,
    };
    let path = PathBuf::from(file);

    let mnemonic = match upload::upload_start(&config, path.clone(), label).await? {
        Some(m) => m,
        None => {
            return Ok(None);
        }
    };

    let result = mnemonic.clone();
    tauri::async_runtime::spawn(async move {
        match upload::upload_chunks(&app_handle, &config, path, result).await {
            Ok(_) => {}
            Err(_) => {}
        };
    });
    Ok(Some(mnemonic))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scan, upload])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
