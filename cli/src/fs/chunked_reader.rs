use crate::error::Result;
use crate::fs::Chunk;
use base64ct::{Base64UrlUnpadded, Encoding};
use sha2::Digest;

use std::{
    fs::File,
    io::{BufReader, Read},
    path::PathBuf,
};

pub struct ChunkedReader {
    inner: BufReader<File>,
    size: usize,
    buf: Vec<u8>,
    pos: usize,
    hashes: Vec<u8>,
}

impl ChunkedReader {
    pub fn from_file(path: PathBuf, chunk_size: usize) -> Result<Self> {
        let file = std::fs::File::open(&path)?;
        let metadata = file.metadata()?;

        Ok(Self {
            inner: std::io::BufReader::new(file),
            buf: vec![0; chunk_size],
            size: metadata.len() as usize,
            pos: 0,
            hashes: Vec::new(),
        })
    }
    pub fn digest_only(path: PathBuf, chunk_size: usize) -> Result<String> {
        let mut reader = Self::from_file(path, chunk_size)?;
        while let Some(_) = reader.read_chunk()? {}
        Ok(reader.digest())
    }

    pub fn read_chunk(&mut self) -> Result<Option<Chunk>> {
        let bytes_read = self.inner.read(&mut self.buf)?;
        if bytes_read == 0 {
            return Ok(None);
        }
        let data = self.buf[..bytes_read].to_vec();
        let digest = sha2::Sha256::digest(&data);
        self.hashes.extend_from_slice(&digest);
        let base64 = Base64UrlUnpadded::encode_string(&digest);

        let chunk = Chunk::new(
            self.pos as u64,
            (self.pos + bytes_read - 1) as u64,
            self.size as u64,
            base64,
            data,
        );

        self.pos += bytes_read;
        Ok(Some(chunk))
    }
    pub fn file_size(&self) -> usize {
        self.size
    }

    pub fn digest(&self) -> String {
        let digest = sha2::Sha256::digest(&self.hashes);
        Base64UrlUnpadded::encode_string(&digest)
    }
}

impl Iterator for ChunkedReader {
    type Item = Result<Chunk>;
    fn next(&mut self) -> Option<Self::Item> {
        match self.read_chunk() {
            Ok(Some(chunk)) => Some(Ok(chunk)),
            Ok(None) => None,
            Err(e) => Some(Err(e)),
        }
    }
}
