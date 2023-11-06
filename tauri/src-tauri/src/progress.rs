use dabih::progress::Listener;
use serde::Serialize;
use tauri::Manager;

#[derive(Debug, Serialize, Clone)]
pub struct Progress {
    mnemonic: String,
    current: u64,
    total: u64,
}

#[derive(Debug, Clone)]
pub struct ProgressListener {
    app_handle: tauri::AppHandle,
}

impl ProgressListener {
    pub fn new(app_handle: &tauri::AppHandle) -> ProgressListener {
        ProgressListener {
            app_handle: app_handle.clone(),
        }
    }
}
impl Listener for ProgressListener {
    fn update(&self, mnemonic: String, current: u64, total: u64) {
        let progress = Progress {
            mnemonic,
            current,
            total,
        };
        self.app_handle
            .emit_all("upload_progress", progress)
            .unwrap();
    }
}
