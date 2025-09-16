use std::path::PathBuf;

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
            let inodes = ctx.api().fs().resolve_path(path).await?;
            if inodes.len() > 1 {
                warn!(
                    "Path {} resolved to multiple entries, downloading the first one",
                    path
                );
            }
            if inodes.is_empty() {
                warn!("Path {} did not resolve to any entries, skipping", path);
                continue;
            }
            base_nodes.push(inodes[0].clone());
        }
        dbg!(&base_nodes);

        let output_path = match &args.output {
            Some(p) => PathBuf::from(p),
            None => PathBuf::from("."),
        };

        dbg!(&path_strings);

        Ok(Downloader { ctx, args })
    }
}
