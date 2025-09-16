use crate::config::Context;
use crate::downloader::Downloader;
use crate::error::Result;
use clap::Args;

#[derive(Args, Debug)]
pub struct Download {
    #[arg(required = true, name = "PATH")]
    pub paths: Vec<String>,

    #[arg(short, long)]
    pub output: Option<String>,

    #[arg(short, long)]
    pub force: bool,
}

pub async fn run(ctx: Context, args: Download) -> Result<()> {
    let downloader = Downloader::from(ctx.clone(), args).await?;

    Ok(())
}
