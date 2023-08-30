use anyhow::{bail, Result};
use glob::glob;
use pbr::{ProgressBar, Units};
use std::fs::File;
use std::io::{self, Read};
use std::path::PathBuf;
use zip::write::FileOptions;
use zip::ZipWriter;

use openssl::base64;
use openssl::sha::sha256;

use crate::api;
use crate::config::Context;

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
        let mut data = base64::decode_block(&hash)?;
        bytes.append(&mut data)
    }
    let hash_buf = sha256(&bytes);
    let hash = base64::encode_block(&hash_buf);
    Ok(hash)
}

pub async fn upload(ctx: &Context, path: PathBuf, name: Option<String>) -> Result<()> {
    println!("Uploading file \"{}\"...", path.display());
    let file_name = path.file_name().unwrap();
    let fname = file_name.to_str().unwrap().to_owned();

    let mnemonic = api::upload_start(ctx, fname, name).await?;
    let mut chunk_hashes = Vec::new();

    let mut file = File::open(&path)?;
    let file_size = file.metadata()?.len();
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
                let delta = bytes as u64;
                let end = current + delta;
                let hash_data = sha256(&chunk_buf);
                let hash = base64::encode_block(&hash_data);
                api::upload_chunk(
                    ctx,
                    &mnemonic,
                    current,
                    end,
                    file_size,
                    hash.clone(),
                    &chunk_buf,
                )
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
