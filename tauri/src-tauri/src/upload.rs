use base64::{engine::general_purpose, Engine as _};
use glob::glob;
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::fs::File;
use std::io::{self, Read, Seek};
use std::path::PathBuf;
use tauri::Manager;

use crate::api;
use crate::{Config, Error, Result};

#[derive(Debug, Serialize, Clone)]
pub struct UploadProgress {
    mnemonic: String,
    current: u64,
    total: u64,
}

fn expand_dir(path: PathBuf) -> Result<Vec<PathBuf>> {
    let mut files = Vec::new();
    let glob_string = path.join("**/*");
    for entry in glob(&glob_string.to_string_lossy())? {
        let path = entry?;
        if path.is_file() {
            files.push(path);
        }
    }
    Ok(files)
}

fn sha256(bytes: &Vec<u8>) -> String {
    let base64 = general_purpose::STANDARD;
    let mut hasher = Sha256::new();
    hasher.update(&bytes);
    let result = hasher.finalize();
    let hash = base64.encode(result);
    return hash;
}

pub fn resolve(paths: Vec<&str>) -> Result<Vec<PathBuf>> {
    let mut entries: Vec<PathBuf> = Vec::new();
    for path in paths {
        for entry in glob(&path)? {
            let path: PathBuf = entry?;
            if path.is_file() {
                entries.push(path);
            } else if path.is_dir() {
                let mut files = expand_dir(path)?;
                entries.append(&mut files);
            }
        }
    }
    Ok(entries)
}

pub fn hash_chunks(hashes: &Vec<String>) -> Result<String> {
    let mut bytes = Vec::new();
    let base64 = general_purpose::STANDARD;

    for hash in hashes {
        let mut data = base64.decode(&hash)?;
        bytes.append(&mut data)
    }
    let hash = sha256(&bytes);
    Ok(hash)
}

pub async fn upload_start(
    ctx: &Config,
    path: PathBuf,
    name: Option<String>,
) -> Result<Option<String>> {
    let file_name = path.file_name().unwrap();
    let fname = file_name.to_str().unwrap().to_owned();
    let mut file = File::open(&path)?;
    let file_size = file.metadata()?.len();
    let chunk_size = 2 * 1024 * 1024; // 2 MiB
    let mut chunk_buf = vec![0u8; chunk_size];
    let size = file.read(&mut chunk_buf)?;
    let data = chunk_buf[0..size].to_vec();
    let hash = sha256(&data);
    let api::Upload {
        mnemonic,
        duplicate,
    } = api::upload_start(ctx, fname, file_size, hash, name).await?;
    if let Some(hash) = duplicate {
        let mut chunk_hashes = Vec::new();
        file.seek(io::SeekFrom::Start(0))?;
        loop {
            match file.read(&mut chunk_buf) {
                Ok(0) => break,
                Ok(bytes) => {
                    let data = chunk_buf[0..bytes].to_vec();
                    let hash = sha256(&data);
                    chunk_hashes.push(hash);
                }
                Err(e) => {
                    return Err(e.into());
                }
            };
        }
        let full_hash = hash_chunks(&chunk_hashes)?;
        if full_hash == hash {
            return Ok(None);
        }
    }

    return Ok(Some(mnemonic));
}

pub async fn upload_chunks(
    app_handle: &tauri::AppHandle,
    ctx: &Config,
    path: PathBuf,
    mnemonic: String,
) -> Result<()> {
    println!("Uploading file \"{}\"...", path.display());

    let mut chunk_hashes = Vec::new();

    let mut file = File::open(&path)?;
    let file_size = file.metadata()?.len();
    let chunk_size = 2 * 1024 * 1024; // 2 MiB
    let mut chunk_buf = vec![0u8; chunk_size];
    let mut current = 0;
    loop {
        match file.read(&mut chunk_buf) {
            Ok(0) => break,
            Ok(bytes) => {
                let data = chunk_buf[0..bytes].to_vec();
                let delta = bytes as u64;
                let end = current + delta;
                let hash = sha256(&data);
                api::upload_chunk(ctx, &mnemonic, current, end, file_size, hash.clone(), &data)
                    .await?;
                chunk_hashes.push(hash);
                current += delta;
                app_handle.emit_all(
                    "upload_progress",
                    UploadProgress {
                        mnemonic: mnemonic.clone(),
                        current,
                        total: file_size,
                    },
                )?;
            }
            Err(e) => {
                return Err(e.into());
            }
        };
    }
    let hash = hash_chunks(&chunk_hashes)?;
    let server_hash = api::upload_finish(ctx, &mnemonic).await?;
    if !hash.eq(&server_hash) {
        return Err(Error::Error("Upload error, hash mismatch".to_owned()));
    }
    Ok(())
}
