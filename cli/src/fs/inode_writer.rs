use std::fs::File;
use std::io::{BufWriter, Write};
use std::path::PathBuf;

use progenitor_client::ByteStream;

use crate::api::types::{Chunk, FileDownload};
use crate::crypto::decrypt_buffer;
use crate::error::Result;

pub struct InodeWriter {
    inner: BufWriter<File>,
    key: Vec<u8>,
    inode: FileDownload,
    pos: usize,
}

pub fn chunk_len(chunk: &Chunk) -> usize {
    let end: usize = chunk.end.parse().unwrap();
    let start: usize = chunk.start.parse().unwrap();
    let s = end - start + 1;
    s as usize
}

impl InodeWriter {
    pub fn from(path: &PathBuf, inode: FileDownload, key: Vec<u8>) -> Result<Self> {
        let file = File::create(path)?;
        let writer = BufWriter::new(file);
        Ok(Self {
            inner: writer,
            key,
            inode,
            pos: 0,
        })
    }
    pub fn read_chunk(&self) -> Option<(&String, &Chunk)> {
        if self.pos >= self.inode.data.chunks.len() {
            return None;
        }
        let chunk = &self.inode.data.chunks[self.pos];
        Some((&self.inode.data.uid, chunk))
    }

    pub fn write_chunk(&mut self, data: Vec<u8>) -> Result<usize> {
        let chunk = &self.inode.data.chunks[self.pos];
        let mut buf = data;
        decrypt_buffer(&mut buf, &self.key, &chunk.iv)?;
        let s = chunk_len(chunk);
        buf.truncate(s);
        self.inner.write_all(&buf)?;
        self.pos += 1;
        Ok(s)
    }
    pub fn close(&mut self) -> std::io::Result<()> {
        self.inner.flush()?;
        Ok(())
    }
}
