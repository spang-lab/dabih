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
struct Upload {
    pub mnemonic: String,
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

pub async fn check_api(ctx: &Config) -> Result<()> {
    let healthy_url = ctx.url.join("/api/v1/healthy")?;
    let res = reqwest::get(healthy_url).await?;
    if !res.status().is_success() {
        return Err(Error::ApiError(format!(
            "Failed to contact api endpoint {}",
            ctx.url
        )));
    }
    Ok(())
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
    println!(
        "Successfully authenticated as {}<{}> (id:{})",
        user.name, user.email, user.sub
    );
    Ok(user)
}

pub async fn upload_start(ctx: &Config, file_name: String, name: Option<String>) -> Result<String> {
    let url = ctx.url.join("/api/v1/upload/start")?;
    let mut data = HashMap::new();
    data.insert("fileName", file_name);
    match name {
        Some(n) => {
            data.insert("name", n);
        }
        None => {}
    };

    let res = ctx.client.post(url).json(&data).send().await?;
    let Upload { mnemonic } = res.json().await?;
    Ok(mnemonic)
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
