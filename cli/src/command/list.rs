use crate::api::InodeType;
use crate::config::Context;
use crate::error::Result;
use clap::Args;
use tracing::warn;

#[derive(Args, Debug)]
pub struct List {
    /// List files in the given path
    #[clap(default_value = ".")]
    pub path: String,
}

pub async fn run(ctx: Context, args: List) -> Result<()> {
    let inodes = ctx.api().fs().resolve_path(&args.path).await?;

    if inodes.len() > 1 {
        warn!(
            "Path {} resolved to multiple entries, showing all of them",
            args.path
        );
    }

    for inode in inodes {
        if inode.r#type == InodeType::File as i32 || inode.r#type == InodeType::Upload as i32 {
            continue;
        }
        println!("{} ({})", inode.name, inode.mnemonic);
    }

    Ok(())
}
