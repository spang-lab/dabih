use std::path::PathBuf;
use std::str::FromStr;

use tracing::warn;

use crate::Context;
use crate::command::download::Download;
use crate::error::Result;

pub struct Downloader {
    ctx: Context,
    args: Download,
}

impl Downloader {
    pub async fn from(ctx: Context, args: Download) -> Result<Downloader> {
        let path_strings = args.paths.clone();

        let mut base_nodes = Vec::new();
        for path in &path_strings {
            let inode = match ctx.api().fs().resolve_path(path).await? {
                Some(inode) => inode,
                None => {
                    warn!("Path {} does not exist, skipping", path);
                    continue;
                }
            };
            base_nodes.push(inode.clone());
        }
        dbg!(&base_nodes);

        let output_path = match &args.output {
            Some(p) => PathBuf::from(p),
            None => PathBuf::from("."),
        };

        let first = base_nodes[0].clone();

        let info = ctx.api().fs().file_info(&first.mnemonic).await?;
        dbg!(&info);

        dbg!(&path_strings);

        Ok(Downloader { ctx, args })
    }
}
