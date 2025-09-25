mod codegen {
    #![allow(dead_code)]
    include!(concat!(env!("OUT_DIR"), "/codegen.rs"));
}
pub use codegen::Client;
pub use codegen::types;
use futures::StreamExt;
use reqwest::StatusCode;

use crate::api::types::Inode;
use crate::error::{CliError, Result};

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
