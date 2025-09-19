use glob::glob;
use std::collections::HashMap;
use std::path::PathBuf;
use std::str::FromStr;
use tracing::{debug, info, warn};

use crate::chunked_reader::ChunkedReader;
use crate::codegen::types::{Mnemonic, UploadStartBody};
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
    Finish,
    Complete,
}

pub struct Uploader {
    state: UploadState,
    ctx: Context,
    args: Upload,

    paths: Vec<(PathBuf, String)>,
    idx: usize,
    mnemonic: Option<String>,
    reader: Option<ChunkedReader>,
    mnemonics: HashMap<String, String>,
}

fn stringify(path: &PathBuf) -> String {
    path.to_string_lossy().replace("\\", "/").to_string()
}

fn rename_target(target: &str, count: usize) -> String {
    if let Some((base, ext)) = target.rsplit_once('.') {
        format!("{}_{}.{}", base, count, ext)
    } else {
        format!("{}_{}", target, count)
    }
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
            mnemonic: None,
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
        match self.ctx.api_().fs().resolve_path(&base).await? {
            Some(inode) => {
                self.mnemonics.insert(base.clone(), inode.mnemonic.clone());
                return Ok((inode.mnemonic.clone(), filename));
            }
            None => {
                return Err(CliError::ApiError(format!(
                    "Failed to resolve target path {}",
                    base
                )));
            }
        }
    }

    pub async fn next(&mut self) -> Result<UploadState> {
        let new_state = match self.state {
            UploadState::Init => self.init().await,
            UploadState::Folder => self.folder().await,
            UploadState::File => self.file().await,
            UploadState::Started { .. } => self.chunk().await,
            UploadState::Chunk { .. } => self.chunk().await,
            UploadState::Finish => self.finish().await,
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
        let (path, target) = &self.paths[self.idx];
        debug!("Processing path {} with target {}", path.display(), target);

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
        let (_path, target) = self.paths[self.idx].clone();

        if let Some(existing) = self.ctx.api_().fs().resolve_path(&target).await? {
            debug!("Directory {} already exists, skipping creation", target);
            self.mnemonics
                .insert(target.clone(), existing.mnemonic.clone());
            self.idx += 1;
            return Ok(UploadState::Init);
        }

        let (mnemonic, name) = self.resolve_target(target.clone()).await?;
        let inode = self
            .ctx
            .api_()
            .fs()
            .add_directory(name.clone(), Some(mnemonic), self.args.tag.clone())
            .await?;

        debug!(
            "Created directory {} with mnemonic {}",
            target, inode.mnemonic
        );
        self.mnemonics
            .insert(target.clone(), inode.mnemonic.clone());

        self.idx += 1;
        Ok(UploadState::Init)
    }

    async fn file(&mut self) -> Result<UploadState> {
        let (path, mut target) = self.paths[self.idx].clone();

        if let Some(existing) = self.ctx.api_().fs().resolve_path(&target).await? {
            if !self.args.rename_existing {
                let hash = ChunkedReader::digest_only(path.clone(), self.args.chunk_size as usize)?;
                let existing_hash = existing
                    .data
                    .unwrap_or_default()
                    .unwrap_or_default()
                    .hash
                    .unwrap_or_default();
                if existing_hash == hash {
                    info!(
                        "File {} already exists with same hash, skipping upload",
                        target
                    );
                    self.idx += 1;
                    return Ok(UploadState::Init);
                }
            }
            let mut count = 1;
            let new_target = loop {
                let new_name = rename_target(&target, count);
                let existing = self.ctx.api_().fs().resolve_path(&new_name).await?;
                if existing.is_none() {
                    break new_name;
                }
                count += 1;
            };
            info!(
                "Renaming file {} to {} to avoid conflict",
                target, new_target
            );
            target = new_target;
        }

        let (mnemonic, name) = self.resolve_target(target.clone()).await?;

        let cs = self.args.chunk_size as usize;
        let reader = ChunkedReader::from_file(path.clone(), cs)?;
        let fs = reader.file_size() as u64;
        self.reader = Some(reader);

        let inode = self
            .ctx
            .api_()
            .upload()
            .start_upload(
                name.clone(),
                Some(mnemonic.clone()),
                Some(stringify(&path)),
                Some(fs),
                self.args.tag.clone(),
            )
            .await?;

        let body = UploadStartBody {
            file_name: name.clone(),
            directory: Some(Mnemonic::from_str(&mnemonic)?),
            file_path: Some(stringify(&path)),
            size: Some(fs as i64),
            tag: self.args.tag.clone(),
        };
        let inode2 = self.ctx.api().start_upload(&body).await?;

        self.mnemonic = Some(inode.mnemonic.clone());
        Ok(UploadState::Started {
            name: name.clone(),
            mnemonic: inode.mnemonic.clone(),
            file_size: fs as u64,
        })
    }
    async fn chunk(&mut self) -> Result<UploadState> {
        let reader = self.reader.as_mut().unwrap();
        let mnemonic = self.mnemonic.as_ref().unwrap();

        let chunk = match reader.read_chunk() {
            Ok(Some(c)) => c,
            Ok(None) => {
                self.idx += 1;
                return Ok(UploadState::Finish);
            }
            Err(e) => {
                return Err(CliError::UnexpectedError(format!(
                    "Failed to read chunk: {}",
                    e
                )));
            }
        };
        let digest = chunk.digest();

        let uchunk = self
            .ctx
            .api_()
            .upload()
            .chunk_upload(mnemonic, &chunk)
            .await?;

        if uchunk.hash != digest {
            return Err(CliError::UnexpectedError(format!(
                "Hash mismatch for chunk in file {}: expected {}, got {}",
                mnemonic, digest, uchunk.hash
            )));
        }
        return Ok(UploadState::Chunk {
            mnemonic: mnemonic.clone(),
            current: chunk.end() + 1,
            total: chunk.file_size(),
        });
    }
    pub async fn finish(&mut self) -> Result<UploadState> {
        let hash = self.reader.as_ref().unwrap().digest();

        let mnemonic = self.mnemonic.as_ref().unwrap();
        let inode = self.ctx.api_().upload().finish_upload(mnemonic).await?;
        let server_hash = inode.data.hash.clone().unwrap_or_default();
        if hash != server_hash {
            return Err(CliError::UnexpectedError(format!(
                "Hash mismatch for file {}: expected {}, got {}",
                mnemonic, hash, server_hash
            )));
        }
        return Ok(UploadState::Init);
    }
}
