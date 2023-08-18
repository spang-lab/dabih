use anyhow::{bail, Result};
use std::path::PathBuf;

use crate::api::{self, Dataset};
use crate::config::Context;
use crate::crypto;

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
) -> Result<()> {
    let path = if output_path.is_dir() {
        output_path.join(&dataset.file_name)
    } else {
        output_path.clone()
    };

    let encrypted_key = api::fetch_key(ctx, &dataset.mnemonic).await?;
    let key = crypto::decrypt_key(ctx, &encrypted_key)?;
    dbg!(key);

    for chunk in &dataset.chunks {
        //api::fetch_chunk(ctx, &dataset.mnemonic, &chunk.url_hash).await?;
    }

    Ok(())
}

pub async fn download_all(
    ctx: &Context,
    mnemonics: &Vec<String>,
    output: &Option<String>,
    force: bool,
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
        download_dataset(ctx, &dataset, &output_path, force).await?;
    }

    Ok(())
}
