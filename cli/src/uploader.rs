use glob::glob;
use openapi::models::AddDirectoryBody;
use std::collections::HashMap;
use std::path::PathBuf;
use tracing::{debug, info, warn};

use openapi::apis::filesystem_api;

use crate::chunked_reader::ChunkedReader;
use crate::command::upload::Upload;
use crate::config::Context;
use crate::error::{CliError, Result};

#[derive(Debug, Clone)]
pub enum UploadState {
    Init,
    File,
    Folder,
    Started {
        name: String,
        mnemonic: String,
        file_size: u64,
    },
    Chunk {
        mnemonic: String,
        current: u64,
        total: u64,
    },
    Complete,
}

pub struct Uploader {
    state: UploadState,
    ctx: Context,
    args: Upload,

    paths: Vec<(PathBuf, String)>,
    idx: usize,
    reader: Option<ChunkedReader>,
    mnemonics: HashMap<String, String>,
}

fn stringify(path: &PathBuf) -> String {
    path.to_string_lossy().replace("\\", "/").to_string()
}

impl Uploader {
    pub fn from(ctx: &Context, args: Upload) -> Result<Uploader> {
        let mut paths: Vec<(PathBuf, String)> = Vec::new();

        let mut path_strings = args.paths.clone();
        let target_str = path_strings.pop().unwrap();
        let target_path = PathBuf::from(&target_str);

        for path_str in path_strings {
            let path = PathBuf::from(path_str);
            if !path.exists() {
                warn!("Path {} does not exist, skipping", path.display());
                continue;
            }
            let abs_path = path.canonicalize()?;
            let parent = abs_path.parent().unwrap().to_path_buf();
            let basename = match abs_path.file_name() {
                Some(name) => name.to_string_lossy().to_string(),
                None => {
                    warn!("Path {} has no basename, skipping", path.display());
                    continue;
                }
            };
            let target = stringify(&target_path.join(&basename));
            paths.push((abs_path.clone(), target));

            if !abs_path.is_dir() {
                continue;
            }

            let glob_string = abs_path.join("**/*");
            for entry in glob(&glob_string.to_string_lossy())? {
                let path: PathBuf = entry?;
                if path.is_dir() || path.is_file() {
                    let rel_path = path.strip_prefix(&parent).unwrap();
                    let target = stringify(&target_path.join(&rel_path));
                    paths.push((path.clone(), target));
                } else {
                    warn!(
                        "Path {} is not a file or directory, skipping",
                        path.display()
                    );
                }
            }
        }

        if paths.len() == 0 {
            info!("No files found to upload. Aborting.");
        }
        Ok(Uploader {
            state: UploadState::Init,
            ctx: ctx.clone(),
            args,
            paths,
            idx: 0,
            reader: None,
            mnemonics: HashMap::new(),
        })
    }
    pub async fn resolve_target(&mut self, target: String) -> Result<(String, String)> {
        let (base, filename) = match target.rsplit_once('/') {
            Some((b, f)) => (b.to_string(), f.to_string()),
            None => (".".to_string(), target),
        };
        let cached = self.mnemonics.get(&base);
        if let Some(mnemonic) = cached {
            return Ok((mnemonic.clone(), filename));
        }

        let inode = match filesystem_api::resolve_path(self.ctx.openapi(), &base).await {
            Ok(resp) => resp,
            Err(e) => {
                return Err(CliError::ApiError(format!(
                    "Failed to resolve path {}: {}",
                    base, e
                )));
            }
        };
        self.mnemonics.insert(base.clone(), inode.mnemonic.clone());
        Ok((inode.mnemonic, filename))
    }

    pub async fn next(&mut self) -> Result<UploadState> {
        let new_state = match self.state {
            UploadState::Init => self.init().await,
            UploadState::Folder => self.folder().await,
            UploadState::File => self.file().await,
            _ => Ok(self.state.clone()),
        }?;
        debug!("Transitioning from {:?} to {:?}", self.state, new_state);
        self.state = new_state.clone();
        return Ok(new_state);
    }

    async fn init(&mut self) -> Result<UploadState> {
        if self.idx >= self.paths.len() {
            return Ok(UploadState::Complete);
        }
        let (path, _) = &self.paths[self.idx];
        debug!("Processing path {}", path.display());

        if path.is_file() {
            return Ok(UploadState::File);
        }
        if path.is_dir() {
            return Ok(UploadState::Folder);
        }
        return Err(CliError::UnexpectedError(format!(
            "Path {} is not a file or directory",
            path.display()
        )));
    }

    async fn folder(&mut self) -> Result<UploadState> {
        let (path, target) = self.paths[self.idx].clone();
        let (mnemonic, name) = self.resolve_target(target.clone()).await?;

        let inode = match filesystem_api::add_directory(
            self.ctx.openapi(),
            AddDirectoryBody {
                name: name.clone(),
                parent: Some(mnemonic.clone()),
                tag: self.args.tag.clone(),
            },
        )
        .await
        {
            Ok(resp) => resp,
            Err(e) => {
                return Err(CliError::ApiError(format!(
                    "Failed to create directory {}: {}",
                    target, e
                )));
            }
        };
        debug!(
            "Created directory {} with mnemonic {}",
            target, inode.mnemonic
        );

        self.idx += 1;
        Ok(UploadState::Init)
    }

    async fn file(&mut self) -> Result<UploadState> {
        let (path, target) = &self.paths[self.idx];
        let cs = self.args.chunk_size as usize;
        let reader = ChunkedReader::from_file(path.clone(), cs)?;
        self.reader = Some(reader);

        Ok(UploadState::Init)
    }

    async fn start(&mut self) -> Result<UploadState> {
        unimplemented!();
    }
}
