use reqwest::header::{self, HeaderMap, HeaderName, HeaderValue};
use reqwest::multipart::{Form, Part};
use serde::Deserialize;
use std::collections::HashMap;

use crate::{Config, Error, Result};

#[derive(Debug, Deserialize)]
pub struct User {
    pub name: String,
    pub email: String,
    pub sub: String,
}
#[derive(Debug, Deserialize)]
pub struct Upload {
    pub mnemonic: String,
    pub duplicate: Option<String>,
}

#[derive(Debug, Deserialize)]
struct UploadResult {
    pub hash: String,
}

#[derive(Debug, Deserialize)]
pub struct Chunk {
    pub hash: String,
    #[serde(rename = "urlHash")]
    pub url_hash: String,
    pub iv: String,
    pub start: u64,
    pub end: u64,
    pub size: u64,
}

#[derive(Debug, Deserialize)]
pub struct Dataset {
    pub mnemonic: String,
    pub hash: String,
    #[serde(rename = "fileName")]
    pub file_name: String,
    pub chunks: Vec<Chunk>,
}

pub async fn get_user(ctx: &Config) -> Result<User> {
    let token_url = ctx.url.join("/api/v1/token")?;
    let res = ctx.client.post(token_url).send().await?;

    let user: User = match res.error_for_status_ref() {
        Ok(_) => res.json().await?,
        Err(_) => {
            let text = res.text().await?;
            return Err(Error::ResponseError(text));
        }
    };
    Ok(user)
}

pub async fn upload_start(
    ctx: &Config,
    file_name: String,
    size: u64,
    chunk_hash: String,
    name: Option<String>,
) -> Result<Upload> {
    let url = ctx.url.join("/api/v1/upload/start")?;
    let mut data = HashMap::new();
    data.insert("fileName", file_name);
    data.insert("chunkHash", chunk_hash);
    data.insert("size", size.to_string());
    match name {
        Some(n) => {
            data.insert("name", n);
        }
        None => {}
    };

    let res = ctx.client.post(url).json(&data).send().await?;
    let result = res.json().await?;
    Ok(result)
}

pub async fn upload_chunk(
    ctx: &Config,
    mnemonic: &String,
    start: u64,
    end: u64,
    total_size: u64,
    hash: String,
    data: &Vec<u8>,
) -> Result<()> {
    let mut headers = HeaderMap::new();

    let content_range = format!("bytes {}-{}/{}", start, end, total_size);
    let digest = format!("sha-256={}", hash);

    headers.insert(
        header::CONTENT_RANGE,
        HeaderValue::from_str(&content_range)?,
    );
    headers.insert(
        HeaderName::from_static("digest"),
        HeaderValue::from_str(&digest)?,
    );

    let form = Form::new().part("chunk", Part::bytes(data.clone()).file_name("chunk.bin"));

    let url = ctx.url.join("/api/v1/upload/")?.join(mnemonic)?;
    ctx.client
        .put(url)
        .multipart(form)
        .headers(headers)
        .send()
        .await?;
    Ok(())
}

pub async fn upload_finish(ctx: &Config, mnemonic: &String) -> Result<String> {
    let url = ctx.url.join("/api/v1/upload/finish/")?.join(mnemonic)?;
    let res = ctx.client.post(url).send().await?;
    let UploadResult { hash } = res.json().await?;
    Ok(hash)
}

pub async fn upload_cancel(ctx: &Config, mnemonic: &String) -> Result<()> {
    let url = ctx.url.join("/api/v1/upload/cancel/")?.join(mnemonic)?;
    let res = ctx.client.post(url).send().await?;
    res.error_for_status()?;
    Ok(())
}
