use anyhow::Result;
use sha2::{Digest, Sha256};
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;

use crate::crypto::encode_base64;

pub fn hash_files(files: &Vec<PathBuf>) -> Result<()> {
    for file in files {
        let hash = hash_file(file)?;
        println!("{} {}", hash, file.display());
    }
    Ok(())
}

fn hash_chunk(bytes: &Vec<u8>) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(&bytes);
    let hash = hasher.finalize().to_vec();
    hash
}

fn hash_file(path: &PathBuf) -> Result<String> {
    let mut hasher = Sha256::new();
    let chunk_size = 2 * 1024 * 1024; // 2 MiB
    let mut chunk_buf = vec![0u8; chunk_size];
    let mut file = File::open(&path)?;
    loop {
        match file.read(&mut chunk_buf) {
            Ok(0) => break,
            Ok(bytes) => {
                let data = chunk_buf[0..bytes].to_vec();
                let hash = hash_chunk(&data);
                hasher.update(&hash);
            }
            Err(e) => {
                return Err(e.into());
            }
        };
    }
    let result = hasher.finalize().to_vec();
    let hash = encode_base64(&result);
    return Ok(hash);
}
