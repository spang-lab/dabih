mod codegen {
    include!(concat!(env!("OUT_DIR"), "/codegen.rs"));
}
pub use codegen::Client;
pub use codegen::types;
use futures::StreamExt;
use reqwest::StatusCode;

use crate::api::types::Inode;
use crate::error::{CliError, Result};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InodeType {
    File = 0,
    Directory = 1,
    Upload = 2,
    Trash = 10,
    Root = 11,
    Home = 12,
}
impl InodeType {
    pub fn from_i32(value: i32) -> Result<Self> {
        match value {
            x if x == InodeType::File as i32 => Ok(InodeType::File),
            x if x == InodeType::Directory as i32 => Ok(InodeType::Directory),
            x if x == InodeType::Upload as i32 => Ok(InodeType::Upload),
            x if x == InodeType::Trash as i32 => Ok(InodeType::Trash),
            x if x == InodeType::Root as i32 => Ok(InodeType::Root),
            x if x == InodeType::Home as i32 => Ok(InodeType::Home),
            _ => Err(CliError::UnexpectedError(format!(
                "Unknown inode type: {}",
                value
            ))),
        }
    }
    pub fn as_char(&self) -> char {
        match self {
            InodeType::File => 'f',
            InodeType::Directory => 'd',
            InodeType::Upload => 'u',
            InodeType::Trash => 't',
            InodeType::Root => 'r',
            InodeType::Home => 'h',
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            InodeType::File => "File",
            InodeType::Directory => "Directory",
            InodeType::Upload => "Upload",
            InodeType::Trash => "Trash",
            InodeType::Root => "Root",
            InodeType::Home => "Home",
        }
    }
    pub fn is_dir(&self) -> bool {
        match self {
            InodeType::File => false,
            InodeType::Upload => false,
            _ => true,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Permission {
    None = 0,
    Read = 1,
    Write = 2,
}

pub trait ApiHelpers {
    async fn resolve_path_h(&self, path: &str) -> Result<Option<Inode>>;
    async fn download_chunk_h(&self, uid: &str, hash: &str) -> Result<Vec<u8>>;
}

impl ApiHelpers for Client {
    async fn resolve_path_h(&self, path: &str) -> Result<Option<Inode>> {
        match self.resolve_path(path).await {
            Ok(r) => Ok(r.into_inner()),
            Err(e) => match e {
                progenitor_client::Error::UnexpectedResponse(r) => {
                    if r.status() == StatusCode::NO_CONTENT {
                        return Ok(None);
                    } else {
                        return Err(CliError::UnexpectedResponse(r));
                    }
                }
                _ => Err(e.into()),
            },
        }
    }
    async fn download_chunk_h(&self, uid: &str, hash: &str) -> Result<Vec<u8>> {
        let mut resp = self.download_chunk(uid, hash).await?.into_inner();
        let mut buf: Vec<u8> = Vec::new();
        while let Some(res) = resp.next().await {
            let part = res?;
            buf.extend_from_slice(&part);
        }
        Ok(buf)
    }
}
