use crate::config::Context;
use crate::crypto::{decode_base64, sha256};
use anyhow::{bail, Result};
use glob::glob;
use pbr::ProgressBar;
use std::io::{self, Read, Seek, SeekFrom};
use std::{fs::File, path::PathBuf};
use zip::write::FileOptions;
use zip::ZipWriter;

use crate::api;

#[derive(Debug)]
struct Chunk {
    start: u64,
    end: u64,
    file_size: u64,
    hash: String,
    data: Vec<u8>,
}

impl Chunk {
    pub fn new(start: u64, data: Vec<u8>, file_size: u64) -> Chunk {
        let size = data.len() as u64;
        let end = start + size;
        let hash = sha256(&data);
        Chunk {
            start,
            end,
            file_size,
            hash,
            data,
        }
    }
    pub async fn upload(&self, ctx: &Context, mnemonic: &String) -> Result<()> {
        api::upload_chunk(
            ctx,
            mnemonic,
            self.start,
            self.end,
            self.file_size,
            &self.hash,
            &self.data,
        )
        .await
    }
}

#[derive(Debug, Clone)]
pub enum UploadState {
    Init,
    Gzip {
        current: u64,
        total: u64,
    },
    File,
    Started {
        mnemonic: String,
        file_size: u64,
    },
    Skipped,
    Duplicate,
    Chunk {
        mnemonic: String,
        current: u64,
        total: u64,
    },
    Complete,
}

pub struct Upload {
    state: UploadState,
    ctx: Context,
    path: PathBuf,
    path_str: String,
    filename: String,
    chunk_size: u64,
    allow_duplicate: bool,
    file_size: Option<u64>,
    name: Option<String>,
    files: Option<Vec<(PathBuf, PathBuf)>>,
    hashes: Option<Vec<String>>,
    zip: Option<ZipWriter<File>>,
    file: Option<File>,
    mnemonic: Option<String>,
}
impl Upload {
    pub fn new(ctx: &Context, path: &PathBuf) -> Result<Upload> {
        let apath = path.canonicalize()?;
        let filename = match apath.file_name() {
            Some(s) => s.to_string_lossy().to_string(),
            None => bail!("Path {} has no filename", apath.display()),
        };
        let path_str = apath.to_string_lossy().to_string();
        let two_mebibyte = 2 * 1024 * 1024;

        Ok(Upload {
            state: UploadState::Init,
            ctx: ctx.clone(),
            path: apath,
            path_str,
            allow_duplicate: false,
            chunk_size: two_mebibyte,
            filename,
            file_size: None,
            name: None,
            files: None,
            hashes: None,
            zip: None,
            file: None,
            mnemonic: None,
        })
    }
    pub fn filename(&self) -> String {
        self.filename.clone()
    }
    pub fn set_allow_duplicate(&mut self, allow_duplicate: bool) {
        self.allow_duplicate = allow_duplicate;
    }

    fn init(&mut self) -> Result<UploadState> {
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

    fn add_to_archive(&mut self, idx: u64, total: u64) -> Result<UploadState> {
        let files = self.files.as_ref().unwrap();
        let mut archive = self.zip.as_mut().unwrap();
        let (file_path, path) = &files[idx as usize];
        let options = FileOptions::default().compression_method(zip::CompressionMethod::Stored);

        let mut fd = File::open(&path)?;
        let file_name = match file_path.to_str() {
            Some(s) => s,
            None => bail!("Invalid path {}", path.display()),
        };
        archive.start_file(file_name, options)?;
        io::copy(&mut fd, &mut archive)?;
        let next_idx = idx + 1;
        if next_idx == total {
            archive.finish()?;
            self.files = None;
            self.zip = None;
            return Ok(UploadState::File);
        }
        Ok(UploadState::Gzip {
            current: next_idx,
            total,
        })
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

    async fn check_for_duplicate(&mut self, hash: String, mnemonic: String) -> Result<UploadState> {
        self.open()?;
        let mut bytes = Vec::new();
        while let Some(chunk) = self.read_chunk()? {
            let mut data = decode_base64(&chunk.hash)?;
            bytes.append(&mut data);
        }
        let full_hash = sha256(&bytes);
        if hash == full_hash {
            api::upload_cancel(&self.ctx, &mnemonic).await?;
            return Ok(UploadState::Duplicate);
        }
        Ok(UploadState::Started {
            mnemonic,
            file_size: self.file_size.unwrap(),
        })
    }

    pub async fn next(&mut self) -> Result<UploadState> {
        let new_state = match self.state {
            UploadState::Init => self.init(),
            UploadState::Gzip { current, total } => self.add_to_archive(current, total),
            UploadState::File => self.start().await,
            UploadState::Duplicate => {
                println!("Upload aborted. File already uploaded.");
                return Ok(self.state.clone());
            }
            UploadState::Started { .. } => self.upload_chunk().await,
            UploadState::Chunk { .. } => self.upload_chunk().await,
            _ => Ok(self.state.clone()),
        }?;
        self.state = new_state.clone();
        return Ok(new_state);
    }
}

pub async fn upload(ctx: &Context, path: &PathBuf, allow_duplicate: bool) -> Result<()> {
    let mut upload = Upload::new(ctx, path)?;
    upload.set_allow_duplicate(allow_duplicate);
    let mut pb = ProgressBar::new(0);
    loop {
        match upload.next().await? {
            UploadState::Gzip { current, total } => {
                if current == 0 {
                    pb = ProgressBar::new(total);
                    let msg = format!("Compressing {} ", upload.filename());
                    pb.message(&msg)
                }
                pb.set(current);
                if current == total - 1 {
                    pb.finish()
                }
            }
            UploadState::File => {}
            UploadState::Skipped => {
                println!("Skipped {}. Done.", upload.filename);
                return Ok(());
            }
            UploadState::Duplicate => {
                println!("{} already uploaded. Skipping.", upload.filename);
                return Ok(());
            }
            UploadState::Started {
                mnemonic,
                file_size,
            } => {
                println!("Uploading {} as {}", upload.filename, mnemonic);
                pb = ProgressBar::new(file_size);
                let msg = format!("Uploading {} ", mnemonic);
                pb.set_units(pbr::Units::Bytes);
                pb.message(&msg)
            }
            UploadState::Chunk {
                mnemonic: _,
                current,
                total: _,
            } => {
                pb.set(current);
            }
            UploadState::Complete => {
                pb.finish();
                println!("Done.");
                return Ok(());
            }
            _ => return Ok(()),
        }
    }
}
