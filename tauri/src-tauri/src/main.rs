// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
use error::{Error, Result};

mod upload;
use dabih::{api, Context};
use std::path::PathBuf;

#[tauri::command]
async fn scan(app_handle: tauri::AppHandle, files: Vec<&str>, zip: bool) -> Result<Vec<PathBuf>> {
    let config_path = match app_handle.path_resolver().app_config_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let config_file = config_path.join("config/app.yaml");
    let ctx = Context::read_without_key(config_file)?;
    api::get_user(&ctx).await?;

    let files = upload::resolve(files, zip)?;
    let paths = files.clone();
    Ok(paths)
}

#[tauri::command]
async fn upload(app_handle: tauri::AppHandle, file: &str) -> Result<Option<String>> {
    let config_path = match app_handle.path_resolver().app_config_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let config_file = config_path.join("config/app.yaml");
    let ctx = Context::read_without_key(config_file)?;
    let path = PathBuf::from(file);

    let label = ctx.name.clone();

    let mnemonic = match dabih::upload::upload_start(&ctx, path.clone(), label).await? {
        Some(m) => m,
        None => {
            return Ok(None);
        }
    };

    let result = mnemonic.clone();
    tauri::async_runtime::spawn(async move {
        match upload::upload_chunks(&app_handle, &ctx, path, result).await {
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
