use glob::glob;
use std::io::{Read, Seek, SeekFrom};
use std::{fs::File, path::PathBuf};
use tracing::{info, warn};

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

    paths: Vec<PathBuf>,
    path: Option<PathBuf>,
    filename: Option<String>,
    file_size: Option<u64>,

    hashes: Option<Vec<String>>,
    file: Option<File>,
    mnemonic: Option<String>,
}

fn expand_dir(path: PathBuf) -> Result<Vec<PathBuf>> {
    let mut files = Vec::new();
    let glob_string = path.join("**/*");
    for entry in glob(&glob_string.to_string_lossy())? {
        let path = entry?;
        if path.is_file() {
            files.push(path);
        }
    }
    Ok(files)
}

impl Uploader {
    pub fn from(ctx: &Context, args: Upload) -> Result<Uploader> {
        let mut paths: Vec<PathBuf> = Vec::new();
        for path in args.paths.iter() {
            for entry in glob(&path)? {
                let path: PathBuf = entry?;
                if path.is_file() {
                    paths.push(path);
                } else if path.is_dir() {
                    let mut files = expand_dir(path)?;
                    paths.append(&mut files);
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
            path: None,
            filename: None,
            file_size: None,
            hashes: None,
            file: None,
            mnemonic: None,
        })
    }

    fn init(&mut self) -> Result<UploadState> {
        let path = match self.paths.pop() {
            Some(p) => p,
            None => return Ok(UploadState::Complete),
        };

        if self.path.is_file() {
            return Ok(UploadState::File);
        }
        if !self.path.is_dir() {
            bail!(
                "Cannot upload {}, not a file and not a directory",
                self.path.display()
            );
        }
        let target = &self.ctx.tmp_path;
        let mut target_file = target.join(&self.filename);
        target_file.set_extension("zip");
        let filename = match target_file.file_name() {
            Some(n) => n.to_string_lossy().to_string(),
            None => self.filename.clone(),
        };
        let zip_file = File::create(&target_file)?;
        let archive = ZipWriter::new(zip_file);
        let glob_string = self.path.join("**/*");
        let mut files = Vec::new();
        for entry in glob(&glob_string.to_string_lossy())? {
            let path = entry?;
            if path.is_file() {
                let local_path = path.strip_prefix(&self.path)?.to_owned();
                files.push((local_path, path))
            }
        }
        let total = files.len() as u64;
        self.files = Some(files);
        self.zip = Some(archive);
        self.filename = filename;
        self.path = target_file;
        Ok(UploadState::Gzip { current: 0, total })
    }

    fn open(&mut self) -> Result<()> {
        let file = File::open(&self.path)?;
        let size = file.metadata()?.len();
        self.file = Some(file);
        self.file_size = Some(size);
        Ok(())
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

    pub async fn next(&mut self) -> Result<UploadState> {
        let new_state = match self.state {
            UploadState::Init => self.init(),
            UploadState::Folder

            UploadState::File => self.start().await,
            UploadState::Started { .. } => self.upload_chunk().await,
            UploadState::Chunk { .. } => self.upload_chunk().await,
            _ => Ok(self.state.clone()),
        }?;
        self.state = new_state.clone();
        return Ok(new_state);
    }
}
