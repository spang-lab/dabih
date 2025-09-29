use std::path::PathBuf;

use crate::error::{CliError, Result};
use crate::fs::ChunkedReader;
use clap::Args;

/// Compute and print the hash of a file in chunks
#[derive(Args, Debug)]
pub struct Hash {
    #[arg(required = true, name = "PATH")]
    pub path: String,

    #[arg(short, long, default_value_t = 2 * 1024 * 1024)]
    pub chunk_size: usize,
}

pub async fn run(args: Hash) -> Result<()> {
    let path = PathBuf::from(args.path);

    if !path.exists() {
        return Err(CliError::PathNotFound(path));
    }
    let digest = ChunkedReader::digest_only(path, args.chunk_size)?;
    println!("{}", digest);
    Ok(())
}
