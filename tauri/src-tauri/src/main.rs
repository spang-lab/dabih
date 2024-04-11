// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
use error::{Error, Result};
use serde::Serialize;

use dabih::upload::{Upload, UploadState};
use dabih::{resolve, Context};
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Clone)]
pub struct UploadProgress {
    id: String,
    state: String,
    mnemonic: Option<String>,
    message: Option<String>,
    current: u64,
    total: u64,
}

impl UploadProgress {
    pub fn new(id: String) -> UploadProgress {
        UploadProgress {
            id,
            state: "init".to_owned(),
            mnemonic: None,
            message: None,
            current: 0,
            total: 0,
        }
    }
    pub fn send(&self, app_handle: &tauri::AppHandle) -> Result<()> {
        app_handle.emit_all("upload_progress", self.clone())?;
        Ok(())
    }
    pub fn set_progress(&mut self, current: u64, total: u64) {
        self.current = current;
        self.total = total;
    }
    pub fn set_message(&mut self, message: String) {
        self.message = Some(message);
    }

    pub fn set_state(&mut self, state: String) {
        self.state = state;
    }
    pub fn set_mnemonic(&mut self, mnemonic: String) {
        self.mnemonic = Some(mnemonic);
    }
}

#[tauri::command]
async fn scan(app_handle: tauri::AppHandle, files: Vec<&str>, zip: bool) -> Result<Vec<PathBuf>> {
    let config_path = match app_handle.path_resolver().app_config_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let config_file = config_path.join("config/app.yaml");
    let ctx = Context::read_without_key(config_file)?;
    dabih::api::get_user(&ctx).await?;

    let paths: Vec<String> = files.into_iter().map(|f| f.to_owned()).collect();

    let files = resolve::resolve(paths, !zip, zip, 0)?;
    Ok(files)
}

#[tauri::command]
async fn upload(app_handle: tauri::AppHandle, file: &str, id: &str) -> Result<()> {
    let config_path = match app_handle.path_resolver().app_config_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let tmp_path = match app_handle.path_resolver().app_cache_dir() {
        Some(p) => p,
        None => return Err(Error::ConfigDirError()),
    };
    let config_file = config_path.join("config/app.yaml");
    let mut ctx = Context::read_without_key(config_file)?;
    ctx.set_tmp_path(tmp_path);

    let path = PathBuf::from(file);
    let id_str = id.to_owned();

    tauri::async_runtime::spawn(async move {
        let mut upload = Upload::new(&ctx, &path).unwrap();
        let mut progress = UploadProgress::new(id_str);
        loop {
            let state = match upload.next().await {
                Ok(s) => s,
                Err(e) => {
                    progress.set_state("error".to_owned());
                    progress.set_message(e.to_string());
                    progress.send(&app_handle).unwrap();
                    return;
                }
            };
            match state {
                UploadState::Init => {}
                UploadState::Gzip { current, total } => {
                    progress.set_state("gzip".to_owned());
                    progress.set_progress(current, total);
                    progress.send(&app_handle).unwrap();
                }
                UploadState::File => {}
                UploadState::Skipped => {
                    progress.set_state("skipped".to_owned());
                    progress.send(&app_handle).unwrap();
                    println!("Skipped {}. Done.", upload.filename());
                    break;
                }
                UploadState::Duplicate => {
                    progress.set_state("duplicate".to_owned());
                    progress.send(&app_handle).unwrap();
                    println!("{} already uploaded. Skipping.", upload.filename());
                    break;
                }
                UploadState::Started {
                    mnemonic,
                    file_size,
                } => {
                    println!("Uploading {} as {}", upload.filename(), &mnemonic);
                    progress.set_mnemonic(mnemonic);
                    progress.set_state("uploading".to_owned());
                    progress.set_progress(0, file_size);
                    progress.send(&app_handle).unwrap();
                }
                UploadState::Chunk {
                    mnemonic: _,
                    current,
                    total,
                } => {
                    progress.set_progress(current, total);
                    progress.send(&app_handle).unwrap();
                }
                UploadState::Complete => {
                    progress.set_state("complete".to_owned());
                    progress.send(&app_handle).unwrap();
                    println!("Done.");
                    break;
                }
            }
        }
    });

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![scan, upload])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
