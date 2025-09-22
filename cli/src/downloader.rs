use std::path::PathBuf;

use tracing::warn;

use crate::Context;
use crate::api::ApiHelpers;
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
            let inode = match ctx.api().resolve_path_h(&path).await? {
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

        let info = ctx.api().file_info(&first.mnemonic).await?;
        dbg!(&info);

        dbg!(&path_strings);

        Ok(Downloader { ctx, args })
    }
}
