use std::fs::{File, create_dir};
use std::path::PathBuf;

use tracing::{debug, warn};

use crate::api::ApiHelpers;
use crate::api::types::{FileDownload, InodeTree};
use crate::command::download::Download;
use crate::config::Context;
use crate::error::Result;
use crate::fs::InodeWriter;
use crate::types::InodeType;

#[derive(Debug, Clone)]
pub enum DownloadState {
    Init,
    Creating,
    Downloading,
    Finishing,
    Canceling,
    Complete,
}

pub struct Downloader {
    state: DownloadState,
    ctx: Context,
    args: Download,
    paths: Vec<(String, PathBuf)>,
    pidx: usize,
    files: Vec<(String, PathBuf)>,
    fidx: usize,
    writer: Option<InodeWriter<File>>,
}

fn rename_path(path: &PathBuf, idx: u64) -> PathBuf {
    let mut new_path = path.clone();
    if let Some(file_name) = path.file_name().and_then(|s| s.to_str()) {
        // Find the first dot → split into base + extension chain
        match file_name.find('.') {
            Some(dot_idx) => {
                let (base, ext) = file_name.split_at(dot_idx);
                let renamed = format!("{}_{}{}", base, idx, ext); // ext already includes the dot
                new_path.set_file_name(renamed);
            }
            None => {
                // No dot = treat as folder
                new_path.set_file_name(format!("{}_{}", file_name, idx));
            }
        }
    }
    new_path
}

fn create_dir_tree(node: &InodeTree, base: &PathBuf) -> Result<Vec<(String, PathBuf)>> {
    let mut files = Vec::new();
    let t = InodeType::from_i32(node.type_)?;
    if t.is_dir() {
        for child in &node.children {
            let child_path = base.join(&child.name);
            if InodeType::from_i32(child.type_)?.is_dir() {
                debug!("Creating directory: {}", child_path.display());
                create_dir(&child_path)?;
            }
            let f = create_dir_tree(child, &child_path)?;
            files.extend(f);
        }
    } else {
        files.push((node.mnemonic.clone(), base.clone()));
        return Ok(files);
    }
    Ok(files)
}

impl Downloader {
    pub async fn from(ctx: Context, args: Download) -> Result<Downloader> {
        let output_path = match &args.output {
            Some(p) => PathBuf::from(p),
            None => PathBuf::from("."),
        };
        let path_strings = args.paths.clone();
        let mut paths = Vec::new();
        for path in &path_strings {
            let inode = match ctx.api().resolve_path_h(&path).await? {
                Some(inode) => inode,
                None => {
                    warn!("Path {} does not exist, skipping", path);
                    continue;
                }
            };
            paths.push((inode.mnemonic.clone(), output_path.join(inode.name)));
        }
        Ok(Downloader {
            state: DownloadState::Init,
            ctx,
            args,
            paths,
            pidx: 0,
            files: Vec::new(),
            fidx: 0,
            writer: None,
        })
    }

    pub async fn init(&mut self) -> Result<DownloadState> {
        let (mnemonic, path) = &self.paths[self.pidx];
        let mut base_path = path.clone();
        if base_path.exists() {
            debug!("Path {} already exists", base_path.display());
            if self.args.rename_existing {
                let mut i = 1;
                loop {
                    let new_path = rename_path(path, i);
                    if !new_path.exists() {
                        base_path = new_path;
                        break;
                    }
                    i += 1;
                }
                debug!(
                    "Renaming existing path {} to {}",
                    path.display(),
                    base_path.display()
                );
            } else {
                warn!("Path {} already exists, skipping", path.display());
                return Ok(DownloadState::Complete);
            }
        }
        let tree = self.ctx.api().inode_tree(mnemonic).await?.into_inner();
        if InodeType::from_i32(tree.type_)?.is_dir() {
            debug!("Creating directory: {}", base_path.display());
            create_dir(&base_path)?;
        }
        self.files = create_dir_tree(&tree, &base_path)?;
        self.fidx = 0;
        Ok(DownloadState::Creating)
    }

    pub async fn create(&mut self) -> Result<DownloadState> {
        let (mnemonic, path) = &self.files[self.fidx];

        let inode = self.ctx.api().file_info(mnemonic).await?.into_inner();
        let private_key = self.ctx.private_key().unwrap();

        let key = private_key.extract_key(&inode)?;

        let writer = InodeWriter::from(path, inode, key)?;
        self.writer = Some(writer);

        Ok(DownloadState::Downloading)
    }

    pub async fn chunk(&mut self) -> Result<DownloadState> {
        let writer = self.writer.as_mut().unwrap();

        let (uid, chunk) = match writer.read_chunk() {
            Some(c) => c,
            None => return Ok(DownloadState::Finishing),
        };
        let buffer = self.ctx.api().download_chunk_h(uid, &chunk.hash).await?;
        writer.write_chunk(buffer)?;
        Ok(DownloadState::Downloading)
    }

    pub async fn finish(&mut self) -> Result<DownloadState> {
        let writer = self.writer.as_mut().unwrap();
        writer.close()?;
        self.fidx += 1;
        self.writer = None;
        if self.fidx >= self.files.len() {
            self.pidx += 1;
            if self.pidx >= self.paths.len() {
                return Ok(DownloadState::Complete);
            } else {
                return Ok(DownloadState::Init);
            }
        }
        Ok(DownloadState::Creating)
    }

    pub async fn next(&mut self) -> Result<DownloadState> {
        let new_state = match &self.state {
            DownloadState::Init => self.init().await?,
            DownloadState::Creating => self.create().await?,
            DownloadState::Downloading => self.chunk().await?,
            DownloadState::Finishing => self.finish().await?,
            _ => DownloadState::Complete,
        };
        debug!("State: {:?} -> {:?}", self.state, new_state);
        self.state = new_state.clone();
        Ok(new_state)
    }
}
