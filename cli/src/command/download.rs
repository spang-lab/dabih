use crate::config::Context;
use crate::downloader::{DownloadState, Downloader};
use crate::error::Result;
use clap::Args;
use tracing::debug;

#[derive(Args, Debug)]
pub struct Download {
    #[arg(required = true, name = "PATH")]
    pub paths: Vec<String>,

    #[arg(short, long)]
    pub output: Option<String>,

    #[arg(short, long, default_value_t = true)]
    pub rename_existing: bool,
}

pub async fn run(ctx: Context, args: Download) -> Result<()> {
    match ctx.private_key() {
        Some(_) => {}
        None => {
            debug!("No private key set, cannot download encrypted files");
            return Err(crate::error::CliError::NoPrivateKey);
        }
    }
    let mut downloader = Downloader::from(ctx.clone(), args).await?;
    loop {
        match downloader.next().await? {
            DownloadState::Init => {
                debug!("Download: Init");
            }
            DownloadState::Creating => {
                debug!("Download: Creating");
            }
            DownloadState::Complete => {
                debug!("Download: Complete");
                break;
            }
            _ => {}
        }
    }

    Ok(())
}
