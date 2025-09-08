use crate::error::Result;
use std::{
    fs::File,
    io::{BufReader, Read},
    path::PathBuf,
};

#[derive(Debug)]
pub struct Chunk {
    // byte offset, 0 based, inclusive
    start: u64,
    // byte offset, 0 based, inclusive
    end: u64,
    // total size of the file in bytes
    file_size: u64,
    data: Vec<u8>,
}

pub struct ChunkedReader {
    path: PathBuf,
    inner: BufReader<File>,
    size: usize,
    buf: Vec<u8>,
    pos: usize,
    chunk_size: usize,
}

impl ChunkedReader {
    pub fn from_file(path: PathBuf, chunk_size: usize) -> Result<Self> {
        let file = std::fs::File::open(&path)?;
        let metadata = file.metadata()?;

        Ok(Self {
            path: path,
            inner: std::io::BufReader::new(file),
            buf: vec![0; chunk_size],
            size: metadata.len() as usize,
            pos: 0,
            chunk_size,
        })
    }
    fn read_chunk(&mut self) -> Result<Option<Chunk>> {
        let bytes_read = self.inner.read(&mut self.buf)?;
        if bytes_read == 0 {
            return Ok(None);
        }
        let chunk = Chunk {
            start: self.pos as u64,
            end: (self.pos + bytes_read - 1) as u64,
            file_size: self.size as u64,
            data: self.buf[..bytes_read].to_vec(),
        };
        self.pos += bytes_read;
        Ok(Some(chunk))
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
