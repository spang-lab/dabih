// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
use error::{Error, Result};

mod progress;

use dabih::{api, upload, Context};
use std::{path::PathBuf, sync::Arc};
use tokio::sync::Mutex;

#[tauri::command]
async fn scan(app_handle: tauri::AppHandle, files: Vec<&str>, zip: bool) -> Result<Vec<PathBuf>> {
    let config_path = match app_handle.path_resolver().app_config_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let config_file = config_path.join("config/app.yaml");
    let ctx = Context::read_without_key(config_file)?;
    api::get_user(&ctx).await?;

    let paths: Vec<String> = files.into_iter().map(|f| f.to_owned()).collect();

    let files = upload::resolve(paths, !zip, zip, 0)?;
    Ok(files)
}

#[tauri::command]
async fn upload(app_handle: tauri::AppHandle, file: &str) -> Result<()> {
    let config_path = match app_handle.path_resolver().app_config_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let tmp_path = match app_handle.path_resolver().app_cache_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let config_file = config_path.join("config/app.yaml");
    let ctx = Context::read_without_key(config_file)?;
    ctx.set_tmp_path(tmp_path);

    let path = PathBuf::from(file);

    tauri::async_runtime::spawn(async move {
        let pb = progress::ProgressListener::new(&app_handle);
        match dabih::upload::upload(&ctx, path, None, Some(&pb)).await {
            Ok(_) => {}
            Err(_) => {}
        };
    });

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scan, upload])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
