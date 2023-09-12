use anyhow::{bail, Result};
use glob::glob;
use pbr::{ProgressBar, Units};
use std::fs::File;
use std::io::{self, Read, Seek};
use std::path::PathBuf;
use zip::write::FileOptions;

use zip::ZipWriter;

use crate::api;
use crate::config::Context;
use crate::crypto::{decode_base64, sha256};

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

fn gzip_dir(path: PathBuf) -> Result<PathBuf> {
    let mut file_path = PathBuf::from(&path);
    file_path.set_extension("zip");

    if file_path.exists() {
        bail!(
            "Could not create {}, file already exists",
            file_path.display()
        );
    }
    let zip_file = File::create(&file_path)?;
    let mut archive = ZipWriter::new(zip_file);
    let glob_string = path.join("**/*");
    for entry in glob(&glob_string.to_string_lossy())? {
        let path = entry?;
        let options = FileOptions::default();
        if !path.is_file() {
            continue;
        }
        let mut fd = File::open(&path)?;
        let file_path = match path.to_str() {
            Some(s) => s,
            None => bail!("Invalid path {}", path.display()),
        };
        archive.start_file(file_path, options)?;
        io::copy(&mut fd, &mut archive)?;
    }
    archive.finish()?;
    Ok(file_path)
}

pub fn resolve(paths: Vec<String>, recursive: bool, zip: bool, limit: i64) -> Result<Vec<PathBuf>> {
    if recursive && zip {
        bail!("The options --recursive and --zip are exclusive and cannot be used together. Aborting.")
    }
    let mut entries: Vec<PathBuf> = Vec::new();
    for path in paths {
        for entry in glob(&path)? {
            let path: PathBuf = entry?;
            if path.is_file() {
                entries.push(path);
            } else if path.is_dir() && recursive {
                let mut files = expand_dir(path)?;
                entries.append(&mut files);
            } else if path.is_dir() && zip {
                let zip_path = gzip_dir(path)?;
                entries.push(zip_path);
            } else {
                bail!("Could not handle path {}, set either the --recursive or --zip flag for folders", path.display());
            }

            if limit > 0 && entries.len() >= limit as usize {
                bail!("Found more than {} files. Aborting. \nUse the option -l to set a different limit.", limit);
            }
        }
    }
    Ok(entries)
}

pub fn hash_chunks(hashes: &Vec<String>) -> Result<String> {
    let mut bytes = Vec::new();
    for hash in hashes {
        let mut data = decode_base64(&hash)?;
        bytes.append(&mut data)
    }
    let hash = sha256(&bytes);
    Ok(hash)
}

pub async fn upload_start(
    ctx: &Context,
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
            api::upload_cancel(ctx, &mnemonic).await?;
            return Ok(None);
        }
    }

    return Ok(Some(mnemonic));
}

pub async fn upload(ctx: &Context, path: PathBuf, name: Option<String>) -> Result<()> {
    println!("Uploading file \"{}\"...", path.display());

    let mnemonic = match upload_start(ctx, path.clone(), name).await? {
        Some(m) => m,
        None => {
            println!("File already uploaded. Skipping.");
            return Ok(());
        }
    };
    let mut file = File::open(&path)?;
    let file_size = file.metadata()?.len();

    let mut chunk_hashes = Vec::new();

    let mut pb = ProgressBar::new(file_size);
    pb.set_units(Units::Bytes);
    let message = format!("as {} ", &mnemonic);
    pb.message(&message);
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
                current = pb.add(delta);
            }
            Err(e) => {
                bail!(e)
            }
        };
    }
    pb.finish();
    let hash = hash_chunks(&chunk_hashes)?;
    let server_hash = api::upload_finish(ctx, &mnemonic).await?;
    if !hash.eq(&server_hash) {
        bail!("Upload error, hash mismatch");
    }
    Ok(())
}
