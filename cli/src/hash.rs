use anyhow::Result;
use pbr::{ProgressBar, Units};
use sha2::{Digest, Sha256};
use std::fs::File;
use std::io::Read;
use std::os::unix::fs::MetadataExt;
use std::path::PathBuf;

use crate::crypto::encode_base64;
use crate::{api, Context};

pub fn hash_files(files: &Vec<PathBuf>) -> Result<()> {
    for file in files {
        let hash = hash_file(file)?;
        println!("{} {}", hash, file.display());
    }
    Ok(())
}

pub async fn hash_and_find(ctx: &Context, files: &Vec<PathBuf>) -> Result<()> {
    for file in files {
        let hash = hash_file(file)?;
        let matches = api::find_hash(ctx, &hash).await?;
        println!("{} {}", hash, file.display());
        if matches.len() == 0 {
            println!("  No matching datasets in dabih.");
        }
        for dset in &matches {
            println!("  {} {}", dset.mnemonic, dset.file_name)
        }
    }
    Ok(())
}

fn hash_chunk(bytes: &Vec<u8>) -> Vec<u8> {
    let mut hasher = Sha256::new();
    hasher.update(&bytes);
    let hash = hasher.finalize().to_vec();
    hash
}

pub fn hash_file(path: &PathBuf) -> Result<String> {
    let mut hasher = Sha256::new();
    let chunk_size = 2 * 1024 * 1024; // 2 MiB
    let mut chunk_buf = vec![0u8; chunk_size];
    let mut file = File::open(&path)?;

    let size = file.metadata()?.size();

    let mut pb = ProgressBar::new(size);
    pb.set_units(Units::Bytes);
    pb.message("Hashing ");
    loop {
        match file.read(&mut chunk_buf) {
            Ok(0) => break,
            Ok(bytes) => {
                let data = chunk_buf[0..bytes].to_vec();
                pb.add(bytes as u64);
                let hash = hash_chunk(&data);
                hasher.update(&hash);
            }
            Err(e) => {
                return Err(e.into());
            }
        };
    }
    pb.finish();
    let result = hasher.finalize().to_vec();
    let hash = encode_base64(&result);
    Ok(hash)
}
