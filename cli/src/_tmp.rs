
fn gzip_dir(path: PathBuf, target: PathBuf) -> Result<PathBuf> {
    if path.is_file() {
        return Ok(path);
    }
    if !path.is_dir() {
        bail!("Cannot gzip {}, not a directory", path.display());
    }
    let cpath = path.canonicalize()?;
    let dirname = match cpath.file_name() {
        Some(n) => n,
        None => bail!("Could not get dirname for {}", path.display()),
    };
    if !target.is_dir() {
        bail!("Target path {} is not a directory", target.display());
    }
    let mut target_file = target.join(dirname);
    target_file.set_extension("zip");

    let zip_file = File::create(&target_file)?;
    let mut archive = ZipWriter::new(zip_file);
    let glob_string = path.join("**/*");
    for entry in glob(&glob_string.to_string_lossy())? {
        let path = entry?;
        let options = FileOptions::default();
        if !path.is_file() {
            continue;
        }
        let mut fd = File::open(&path)?;
        let file_path = match path.to_str() {
            Some(s) => s,
            None => bail!("Invalid path {}", path.display()),
        };
        archive.start_file(file_path, options)?;
        io::copy(&mut fd, &mut archive)?;
    }
    archive.finish()?;
    Ok(target_file)
}

pub fn hash_chunks(hashes: &Vec<String>) -> Result<String> {
    let mut bytes = Vec::new();
    for hash in hashes {
        let mut data = decode_base64(&hash)?;
        bytes.append(&mut data)
    }
    let hash = sha256(&bytes);
    Ok(hash)
}

struct Chunk {
    start: u64,
    end: u64,
    size: u64,
    file_size: u64,
    hash: String,
    data: Vec<u8>,
}

impl Chunk {
    pub fn new(start: u64, data: Vec<u8>, file_size: u64) -> Chunk {
        let size = data.len() as u64;
        let end = start + size;
        let hash = sha256(&data);
        Chunk { start, end, size, file_size, hash, data }
    }
    fn hash(&self) -> String {
        sha256(&self.data)
    }
}

struct Chunks {
    file: File,
    file_size: u64,
    chunk_size: usize,
}
impl Chunks {
    pub fn from(path: &PathBuf) -> Result<Chunks> {
        if !path.is_file() {
            bail!("{} is not a file.", path.display());
        }
        let mut file = File::open(path)?;
        let two_mebibyte = 2 * 1024 * 1024;
        file.seek(io::SeekFrom::Start(0))?;
        let file_size = file.metadata()?.len();
        Ok(Chunks {
            file,
            chunk_size: two_mebibyte,
            file_size,
        })
    }
}
impl Iterator for Chunks {
    type Item = Result<Chunk>;
    fn next(&mut self) -> Option<Self::Item> {
        let start = match self.file.seek(io::SeekFrom::Current(0)) {
            Ok(s) => s,
            Err(e) => return Some(Err(Error::new(e))),
        };
        let size = self.chunk_size;
        let mut chunk_buf = vec![0u8; size];

        match self.file.read(&mut chunk_buf) {
            Ok(0) => None,
            Ok(bytes) => {
                let data = chunk_buf[0..bytes].to_vec();
                let chunk = Chunk::new(start, data, self.file_size);
                Some(Ok(chunk))
            }
            Err(e) => Some(Err(Error::new(e))),
        }
    }
}

struct Upload {
    ctx: Context,
    path: PathBuf,
    name: Option<String>,
    path_str: String,
    filename: String,
    mnemonic: Option<String>,
    chunks: Option<Chunks>,
}

impl Upload {
    pub fn new(ctx: &Context, path: &PathBuf) -> Result<Upload> {
        let apath = path.canonicalize()?;
        let filename = match apath.file_name() {
            Some(s) => s.to_string_lossy().to_string(),
            None => bail!("Path {} has no filename", apath.display()),
        };
        let path_str = apath.to_string_lossy().to_string();

        Ok(Upload {
            ctx: ctx.clone(),
            path: apath,
            path_str,
            filename,
            name: None,
            mnemonic: None,
            chunks: None,
        })
    }

    pub fn to_file(&mut self) -> Result<()> {
        if self.path.is_file() {
            return Ok(());
        }
        if !self.path.is_dir() {
            bail!("Cannot gzip {}, not a directory", self.path.display());
        }
        let target = &self.ctx.tmp_path;
        if !target.is_dir() {
            bail!("Target path {} is not a directory", target.display());
        }
        let mut target_file = target.join(&self.filename);
        target_file.set_extension("zip");
        let zip_file = File::create(&target_file)?;
        let mut archive = ZipWriter::new(zip_file);
        let glob_string = self.path.join("**/*");
        for entry in glob(&glob_string.to_string_lossy())? {
            let path = entry?;
            let options = FileOptions::default();
            if !path.is_file() {
                continue;
            }
            let mut fd = File::open(&path)?;
            let file_path = match path.to_str() {
                Some(s) => s,
                None => bail!("Invalid path {}", path.display()),
            };
            archive.start_file(file_path, options)?;
            io::copy(&mut fd, &mut archive)?;
        }
        archive.finish()?;
        self.path = target_file;
        Ok(())
    }
    pub fn chunks(&self) -> Result<Chunks> {
        Chunks::from(&self.path)
    }

    pub async fn start(&mut self) -> Result<()> {
        self.to_file()?;
        let chunk = match self.chunks()?.next() {
            Some(r) => r?,
            None => {
                bail!("File is empty.")
            }
        }
        
        let api::Upload {
            mnemonic,
            duplicate,
        } = api::upload_start(self.ctx,
                              self.filename,
                              self.path_str, file_size, hash, name).await?;




        bail!("")
    }
}

pub async fn upload_start(
    ctx: &Context,
    path: PathBuf,
    name: Option<String>,
) -> Result<Option<String>> {
    let file_name = path.file_name().unwrap();
    let fname = file_name.to_str().unwrap().to_owned();
    let path_str = path.canonicalize()?.to_string_lossy().to_string();
    let mut file = File::open(&path)?;
    let file_size = file.metadata()?.len();
    let chunk_size = 2 * 1024 * 1024; // 2 MiB
    let mut chunk_buf = vec![0u8; chunk_size];
    let size = file.read(&mut chunk_buf)?;
    let data = chunk_buf[0..size].to_vec();
    let hash = sha256(&data);
    let api::Upload {
        mnemonic,
        duplicate,
    } = api::upload_start(ctx, fname, path_str, file_size, hash, name).await?;
    if let Some(hash) = duplicate {
        let mut chunk_hashes = Vec::new();
        file.seek(io::SeekFrom::Start(0))?;
        loop {
            match file.read(&mut chunk_buf) {
                Ok(0) => break,
                Ok(bytes) => {
                    let data = chunk_buf[0..bytes].to_vec();
                    let hash = sha256(&data);
                    chunk_hashes.push(hash);
                }
                Err(e) => {
                    return Err(e.into());
                }
            };
        }
        let full_hash = hash_chunks(&chunk_hashes)?;
        if full_hash == hash {
            api::upload_cancel(ctx, &mnemonic).await?;
            return Ok(None);
        }
    }

    return Ok(Some(mnemonic));
}

pub async fn upload(
    ctx: &Context,
    path: PathBuf,
    cname: Option<String>,
    listener: Option<&dyn Listener>,
) -> Result<Option<String>> {
    println!("Uploading \"{}\"...", path.display());
    let fpath = gzip_dir(path, ctx.get_tmp_dir()?)?;

    let name = match cname {
        Some(n) => Some(n),
        None => ctx.name.clone(),
    };

    let mnemonic = match upload_start(ctx, fpath.clone(), name).await? {
        Some(m) => m,
        None => {
            println!("File already uploaded. Skipping.");
            return Ok(None);
        }
    };
    let mut file = File::open(&fpath)?;
    let file_size = file.metadata()?.len();
    if file_size == 0 {
        println!("Skipping empty file {}", fpath.display());
        return Ok(None);
    }

    let mut chunk_hashes = Vec::new();

    let mut pb = match listener {
        Some(_) => None,
        None => {
            let mut p = ProgressBar::new(file_size);
            p.set_units(pbr::Units::Bytes);
            let message = format!("as {} ", mnemonic);
            p.message(&message);
            Some(p)
        }
    };

    let chunk_size = 2 * 1024 * 1024; // 2 MiB
    let mut chunk_buf = vec![0u8; chunk_size];
    let mut current = 0;
    loop {
        match file.read(&mut chunk_buf) {
            Ok(0) => break,
            Ok(bytes) => {
                let data = chunk_buf[0..bytes].to_vec();
                let delta = bytes as u64;
                let end = current + delta;
                let hash = sha256(&data);
                api::upload_chunk(ctx, &mnemonic, current, end, file_size, hash.clone(), &data)
                    .await?;
                chunk_hashes.push(hash);
                if let Some(ref mut p) = pb {
                    p.add(delta);
                }

                current += delta;
            }
            Err(e) => {
                bail!(e)
            }
        };
    }
    if let Some(ref mut p) = pb {
        p.finish();
    }
    let hash = hash_chunks(&chunk_hashes)?;
    let server_hash = api::upload_finish(ctx, &mnemonic).await?;
    if !hash.eq(&server_hash) {
        bail!("Upload error, hash mismatch");
    }
    Ok(Some(mnemonic))
}
