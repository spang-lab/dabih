use crate::config::Context;
use crate::error::Result;
use clap::Args;
use tracing::debug;

#[derive(Args, Debug)]
pub struct Member {
    pub mnemonic: String,

    /// If set, add a read permission for the given user
    #[arg(short, long, name = "readuser")]
    pub read: Option<String>,

    /// If set, add a write permission for the given user
    #[arg(short, long, name = "writeuser")]
    pub write: Option<String>,

    /// If set, remove all permissions for the given user
    #[arg(short, long, name = "noneuser")]
    pub none: Option<String>,
}

pub async fn run(ctx: Context, args: Member) -> Result<()> {
    debug!("Member args: {:?}", args);

    let users = ctx.api().list_users().await?.into_inner();
    dbg!(users);

    Ok(())
}
