use std::{env, path::PathBuf};

use config::Context;

mod config;
mod error;
use error::Result;
mod private_key;

#[tokio::main]
async fn main() -> Result<()> {
    let ctx_path = match env::var("XDG_CONFIG_HOME") {
        Ok(v) => PathBuf::from(v).join("dabih"),
        Err(_) => PathBuf::from(env::var("HOME").unwrap())
            .join(".config")
            .join("dabih"),
    };
    let mut ctx = Context::from(ctx_path)?;
    ctx.init().await?;

    Ok(())
}
