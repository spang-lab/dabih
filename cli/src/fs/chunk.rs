#[derive(Debug)]
pub struct Chunk {
    // byte offset, 0 based, inclusive
    start: u64,
    // byte offset, 0 based, inclusive
    end: u64,
    // total size of the file in bytes
    file_size: u64,
    data: Vec<u8>,
    digest: String,
}

impl Chunk {
    pub fn new(start: u64, end: u64, file_size: u64, digest: String, data: Vec<u8>) -> Self {
        Self {
            start,
            end,
            file_size,
            digest,
            data,
        }
    }

    pub fn content_range(&self) -> String {
        format!("bytes {}-{}/{}", self.start, self.end, self.file_size)
    }
    pub fn digest(&self) -> &str {
        &self.digest
    }
    pub fn data(&self) -> &[u8] {
        &self.data
    }
    pub fn start(&self) -> u64 {
        self.start
    }
    pub fn end(&self) -> u64 {
        self.end
    }
    pub fn file_size(&self) -> u64 {
        self.file_size
    }
}
