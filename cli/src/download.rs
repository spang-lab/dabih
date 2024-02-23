use anyhow::{bail, Result};
use pbr::{ProgressBar, Units};
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;

use crate::api::{self, Dataset};
use crate::config::Context;
use crate::crypto;
use crate::hash::hash_file;

pub async fn resolve_mnemonics(ctx: &Context, mnemonics: &Vec<String>) -> Result<Vec<Dataset>> {
    let mut datasets = Vec::new();
    for mnemonic in mnemonics {
        match api::fetch_dataset(ctx, mnemonic).await {
            Ok(d) => datasets.push(d),
            Err(e) => {
                println!("{}", e);
            }
        };
    }
    Ok(datasets)
}

pub async fn download_dataset(
    ctx: &Context,
    dataset: &Dataset,
    output_path: &PathBuf,
    force: bool,
    validate: bool,
) -> Result<()> {
    let path = if output_path.is_dir() {
        output_path.join(&dataset.file_name)
    } else {
        output_path.clone()
    };
    if path.exists() {
        if !force {
            bail!(
                "Cannot download to {}, file already exists. Use -f to overwrite.",
                path.display()
            );
        }
        println!("Overwriting {}", path.display());
    }

    let encrypted_key = api::fetch_key(ctx, &dataset.mnemonic).await?;
    let private_key = ctx.key()?;
    let key = private_key.decrypt_key(&encrypted_key)?;

    let mut file = File::create(&path)?;

    let chunks = match &dataset.chunks {
        Some(c) => c,
        None => bail!("No chunks in dataset"),
    };

    let total_size = match chunks.get(0) {
        Some(c) => c.size,
        None => 0,
    };

    let mut pb = ProgressBar::new(total_size);
    pb.set_units(Units::Bytes);
    let message = format!("Downloading {} ", &dataset.mnemonic);
    pb.message(&message);
    for chunk in chunks {
        let chunk_size = chunk.end - chunk.start;
        pb.add(chunk_size);
        let encrypted = api::fetch_chunk(ctx, &dataset.mnemonic, &chunk.url_hash).await?;
        let decrypted = crypto::decrypt_chunk(chunk, &key, &encrypted)?;
        file.write(&decrypted)?;
    }
    pb.finish();
    if !validate {
        return Ok(());
    }
    let hash = hash_file(&path)?;
    let server_hash = match &dataset.hash {
        Some(h) => h,
        None => bail!("Cannot validate, server dataset has no hash"),
    };
    if server_hash.ne(&hash) {
        bail!(
            "Download did not complete successfully! Hash mismatch {} != {}",
            hash,
            server_hash
        );
    }
    Ok(())
}

pub async fn download_all(
    ctx: &Context,
    mnemonics: &Vec<String>,
    output: &Option<String>,
    force: bool,
    validate: bool,
) -> Result<()> {
    if mnemonics.is_empty() {
        bail!("Please specify mnemonics to download as arguments")
    }

    let output_path = match output {
        Some(p) => PathBuf::from(p),
        None => PathBuf::from("."),
    };
    if !output_path.is_dir() && mnemonics.len() > 1 {
        bail!("Please specify a folder as output, or only download a single mnemonic")
    }

    let datasets = resolve_mnemonics(ctx, mnemonics).await?;
    for dataset in datasets {
        download_dataset(ctx, &dataset, &output_path, force, validate).await?;
    }

    Ok(())
}
