use glob::glob;
use std::collections::HashMap;
use std::io::{Read, Seek, SeekFrom};
use std::path::PathBuf;
use tracing::{info, warn};

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

impl Uploader {
    pub fn from(ctx: &Context, args: Upload) -> Result<Uploader> {
        let mut paths: Vec<(PathBuf, String)> = Vec::new();
        for path_str in args.paths.iter() {
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
            let target = match &args.target_dir {
                Some(dir) => {
                    let mut dir_path = PathBuf::from(dir);
                    dir_path.push(basename);
                    dir_path.to_string_lossy().to_string()
                }
                None => basename,
            };
            paths.push((abs_path.clone(), target));
            if abs_path.is_dir() {
                let glob_string = abs_path.join("**/*");
                for entry in glob(&glob_string.to_string_lossy())? {
                    let path: PathBuf = entry?;
                    if path.is_file() || path.is_dir() {
                        let rel_path = path
                            .strip_prefix(&parent)
                            .unwrap()
                            .to_string_lossy()
                            .to_string();
                        match &args.target_dir {
                            Some(dir) => {
                                let mut dir_path = PathBuf::from(dir);
                                dir_path.push(&rel_path);
                                paths.push((path, dir_path.to_string_lossy().to_string()));
                            }
                            None => {
                                paths.push((path, rel_path));
                            }
                        }
                    } else {
                        warn!(
                            "Path {} is not a file or directory, skipping",
                            path.display()
                        );
                    }
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
    pub async fn next(&mut self) -> Result<UploadState> {
        let new_state = match self.state {
            UploadState::Init => self.init(),
            UploadState::Folder => self.folder().await,
            UploadState::File => self.file().await,
            UploadState::Started { .. } => self.upload_chunk().await,
            UploadState::Chunk { .. } => self.upload_chunk().await,
            _ => Ok(self.state.clone()),
        }?;
        self.state = new_state.clone();
        return Ok(new_state);
    }

    fn init(&mut self) -> Result<UploadState> {
        if self.idx >= self.paths.len() {
            return Ok(UploadState::Complete);
        }
        let (path, target) = &self.paths[self.idx];

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
        let (path, target) = &self.paths[self.idx];

        self.idx += 1;
        Ok(UploadState::Init)
    }

    async fn file(&mut self) -> Result<UploadState> {
        let path = &self.paths[self.idx];
        let cs = self.args.chunk_size as usize;
        let reader = ChunkedReader::from_file(path.clone(), cs)?;
        self.reader = Some(reader);

        Ok(UploadState::Init)
    }

    fn read_chunk(&mut self) -> Result<Option<Chunk>> {
        let mut file = self.file.take().unwrap();
        let file_size = self.file_size.unwrap();
        let size = self.chunk_size;

        let mut chunk_buf = vec![0u8; size as usize];
        let start = file.seek(SeekFrom::Current(0))?;

        let bytes = file.read(&mut chunk_buf)?;
        if bytes == 0 {
            return Ok(None);
        }
        let data = chunk_buf[0..bytes].to_vec();
        let chunk = Chunk::new(start, data, file_size);

        self.file = Some(file);
        Ok(Some(chunk))
    }

    async fn start(&mut self) -> Result<UploadState> {
        self.open()?;
        let chunk = match self.read_chunk()? {
            Some(c) => c,
            None => return Ok(UploadState::Skipped),
        };
        // reset the file
        self.open()?;
        let api::Upload {
            mnemonic,
            duplicate,
        } = api::upload_start(
            &self.ctx,
            self.filename.clone(),
            self.path_str.clone(),
            chunk.file_size.clone(),
            chunk.hash.clone(),
            self.name.clone(),
        )
        .await?;
        if !self.allow_duplicate {
            if let Some(hash) = duplicate {
                return self.check_for_duplicate(hash, mnemonic).await;
            }
        }
        self.mnemonic = Some(mnemonic.clone());
        self.hashes = Some(Vec::new());
        Ok(UploadState::Started {
            mnemonic,
            file_size: self.file_size.unwrap(),
        })
    }

    async fn upload_chunk(&mut self) -> Result<UploadState> {
        let chunk = match self.read_chunk()? {
            Some(c) => c,
            None => return self.upload_finish().await,
        };
        match &mut self.hashes {
            Some(hashes) => hashes.push(chunk.hash.clone()),
            None => bail!("Hashes not initialized"),
        };

        let mnemonic = self.mnemonic.clone().unwrap();
        chunk.upload(&self.ctx, &mnemonic).await?;
        Ok(UploadState::Chunk {
            mnemonic,
            current: chunk.end,
            total: chunk.file_size,
        })
    }
    fn hash(&self) -> Result<String> {
        let hashes = match self.hashes.as_ref() {
            Some(h) => h,
            None => bail!("no self.hashes"),
        };
        let mut bytes = Vec::new();
        for hash in hashes {
            let mut data = decode_base64(&hash)?;
            bytes.append(&mut data)
        }
        let hash = sha256(&bytes);
        Ok(hash)
    }

    async fn upload_finish(&mut self) -> Result<UploadState> {
        let mnemonic = self.mnemonic.clone().unwrap();
        let server_hash = api::upload_finish(&self.ctx, &mnemonic).await?;
        let local_hash = self.hash()?;
        if server_hash != local_hash {
            bail!(
                "Hash mismatch: local:'{}' remote: '{}'",
                local_hash,
                server_hash
            );
        }
        Ok(UploadState::Complete)
    }
}
