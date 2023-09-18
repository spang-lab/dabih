use anyhow::{bail, Result};
use pbr::{ProgressBar, Units};

use crate::api::Dataset;
use crate::crypto::{decrypt_chunk, decrypt_key, fingerprint, read_private_key};
use serde::Deserialize;
use std::fs::File;
use std::io::{Read, Write};
use std::path::PathBuf;

#[derive(Deserialize, Debug)]
pub struct RecoveryKey {
    #[serde(rename = "encryptedKey")]
    encrypted_key: String,
    fingerprint: String,
}

#[derive(Deserialize, Debug)]
pub struct RecoveryInfo {
    dataset: Dataset,
    keys: Vec<RecoveryKey>,
}

fn get_output_path(path: &PathBuf, file_name: &String, output: &Option<String>) -> Result<PathBuf> {
    let output_path = match output {
        Some(p) => PathBuf::from(p),
        None => path.clone(),
    };
    let path = if output_path.is_dir() {
        output_path.join(file_name)
    } else {
        output_path.clone()
    };
    if path.exists() {
        bail!(
            "Cannot recover to {}, file already exists. ",
            path.display()
        );
    }
    Ok(path)
}

fn read_chunk(path: &PathBuf, hash: &String) -> Result<Vec<u8>> {
    let chunk_path = path.join(hash);
    if !chunk_path.is_file() {
        bail!("Chunk {} not found or not readable.", chunk_path.display());
    }
    let mut file = File::open(chunk_path)?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;
    Ok(buffer)
}

pub fn recover(key_file: &String, path_str: &String, output: &Option<String>) -> Result<()> {
    let key = read_private_key(key_file)?;
    let root_fingerprint = fingerprint(&key)?;

    let path = PathBuf::from(path_str);
    let recovery_path = path.join("recovery.yaml");
    if !recovery_path.exists() {
        bail!(
            "Recovery file \"{}\" not found, or not readable",
            recovery_path.display()
        );
    }
    let recovery_file = File::open(recovery_path)?;
    let RecoveryInfo { dataset, keys } = serde_yaml::from_reader(recovery_file)?;

    let mut encrypted = None;
    for key in keys {
        let RecoveryKey {
            encrypted_key,
            fingerprint,
        } = key;
        if fingerprint == root_fingerprint {
            encrypted = Some(encrypted_key)
        }
    }
    let encrypted = match encrypted {
        Some(k) => k,
        None => bail!("Root key {} is not in the recovery keys.", root_fingerprint),
    };
    let aes_key = decrypt_key(key, &encrypted)?;
    let output_path = get_output_path(&path, &dataset.file_name, output)?;

    let mut file = File::create(output_path)?;

    let total_size = match dataset.chunks.get(0) {
        Some(c) => c.size,
        None => 0,
    };

    let mut pb = ProgressBar::new(total_size);
    pb.set_units(Units::Bytes);
    let message = format!("Recovering {} ", &dataset.mnemonic);
    pb.message(&message);
    for chunk in &dataset.chunks {
        let chunk_size = chunk.end - chunk.start;
        pb.add(chunk_size);
        let encrypted = read_chunk(&path, &chunk.url_hash)?;
        let decrypted = decrypt_chunk(chunk, &aes_key, &encrypted)?;
        file.write(&decrypted)?;
    }
    pb.finish();

    Ok(())
}
