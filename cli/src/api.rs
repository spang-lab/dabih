use std::collections::HashMap;

use anyhow::{bail, Result};

use crate::config::Context;
use reqwest::header::{self, HeaderMap, HeaderName, HeaderValue};
use reqwest::multipart::{Form, Part};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
struct User {
    pub name: String,
    pub email: String,
    pub sub: String,
}
#[derive(Debug, Deserialize)]
struct KeyStatus {
    pub valid: bool,
    pub error: Option<String>,
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

#[derive(Debug, Deserialize, Serialize)]
pub struct Chunk {
    pub hash: String,
    #[serde(rename = "urlHash")]
    pub url_hash: String,
    pub iv: String,
    pub start: u64,
    pub end: u64,
    pub size: u64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Member {
    pub sub: String,
    pub permission: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Dataset {
    pub mnemonic: String,
    pub name: Option<String>,
    pub hash: Option<String>,
    #[serde(rename = "fileName")]
    pub file_name: String,
    pub size: Option<String>,
    #[serde(rename = "createdBy")]
    pub created_by: String,
    pub chunks: Option<Vec<Chunk>>,
    pub members: Option<Vec<Member>>,
}

#[derive(Debug, Deserialize)]
pub struct SearchResult {
    pub count: u64,
    pub datasets: Vec<Dataset>,
}

async fn check_api(ctx: &Context) -> Result<()> {
    let healthy_url = ctx.url.join("/api/v1/healthy")?;
    let res = reqwest::get(healthy_url).await?;
    if !res.status().is_success() {
        bail!("Failed to contact api endpoint {}", ctx.url)
    }
    Ok(())
}

pub async fn get_user(ctx: &Context) -> Result<()> {
    let token_url = ctx.url.join("/api/v1/token")?;
    let res = ctx.client.post(token_url).send().await?;

    let user: User = match res.error_for_status_ref() {
        Ok(_) => res.json().await?,
        Err(_) => {
            let text = res.text().await?;
            bail!(text);
        }
    };
    println!(
        "Successfully authenticated as {}<{}> (id:{})",
        user.name, user.email, user.sub
    );
    Ok(())
}

pub async fn check_key(ctx: &Context) -> Result<()> {
    check_api(ctx).await?;
    get_user(ctx).await?;

    if ctx.key.is_none() {
        println!("No private_key, only upload will work.");
        return Ok(());
    }

    let fingerprint = ctx.key()?.fingerprint()?;

    let key_url = ctx.url.join("/api/v1/key/check")?;

    let mut data = HashMap::new();
    data.insert("keyHash", &fingerprint);
    let res = ctx.client.post(key_url).json(&data).send().await?;
    let status: KeyStatus = match res.error_for_status() {
        Ok(res) => res.json().await?,
        Err(e) => bail!(e),
    };
    let KeyStatus { error, valid } = status;

    if let Some(err) = error {
        bail!(err)
    }

    if !valid {
        bail!("Invalid key")
    }
    println!("Key with fingerprint {} is valid", fingerprint);
    Ok(())
}

pub async fn upload_start(
    ctx: &Context,
    file_name: String,
    path: String,
    size: u64,
    chunk_hash: String,
    name: Option<String>,
) -> Result<Upload> {
    let url = ctx.url.join("/api/v1/upload/start")?;
    let mut data = HashMap::new();
    data.insert("fileName", file_name);
    data.insert("path", path);
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
    ctx: &Context,
    mnemonic: &String,
    start: u64,
    end: u64,
    total_size: u64,
    hash: &String,
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

pub async fn upload_finish(ctx: &Context, mnemonic: &String) -> Result<String> {
    let url = ctx.url.join("/api/v1/upload/finish/")?.join(mnemonic)?;
    let res = ctx.client.post(url).send().await?;
    let UploadResult { hash } = res.json().await?;
    Ok(hash)
}

pub async fn upload_cancel(ctx: &Context, mnemonic: &String) -> Result<()> {
    let url = ctx.url.join("/api/v1/upload/cancel/")?.join(mnemonic)?;
    let res = ctx.client.post(url).send().await?;
    res.error_for_status()?;
    Ok(())
}

pub async fn fetch_dataset(ctx: &Context, mnemonic: &String) -> Result<Dataset> {
    let url = ctx.url.join("/api/v1/dataset/")?.join(mnemonic)?;
    let res = ctx.client.get(url).send().await?;
    match res.error_for_status() {
        Ok(res) => {
            let dataset: Dataset = res.json().await?;
            Ok(dataset)
        }
        Err(_) => {
            bail!("Failed to download {}, dataset does not exist", mnemonic);
        }
    }
}

pub async fn search_datasets(ctx: &Context, query: String, uploader: bool) -> Result<Vec<Dataset>> {
    let url = ctx.url.join("/api/v1/dataset/search")?;
    let mut data = HashMap::new();
    data.insert("query", query);
    if uploader {
        data.insert("uploader", "true".to_owned());
    }
    let res = ctx.client.post(url).json(&data).send().await?;
    match res.error_for_status() {
        Ok(res) => {
            let SearchResult { count: _, datasets } = res.json().await?;
            return Ok(datasets);
        }
        Err(e) => {
            bail!("Failed to search: {}", e);
        }
    }
}

pub async fn add_member(
    ctx: &Context,
    mnemonic: &String,
    sub: &String,
    key: &String,
) -> Result<()> {
    let path = format!("/api/v1/dataset/{}/member/add", mnemonic);
    let url = ctx.url.join(&path)?;
    let mut data = HashMap::new();
    data.insert("member", sub);
    data.insert("key", key);
    let res = ctx.client.post(url).json(&data).send().await?;
    match res.error_for_status_ref() {
        Ok(_) => Ok(()),
        Err(_) => {
            let text = res.text().await?;
            bail!(text);
        }
    }
}
pub async fn set_member_access(
    ctx: &Context,
    mnemonic: &String,
    sub: &String,
    permission: &String,
) -> Result<()> {
    let path = format!("/api/v1/dataset/{}/member/set", mnemonic);
    let url = ctx.url.join(&path)?;
    let mut data = HashMap::new();
    data.insert("user", sub);
    data.insert("permission", permission);
    let res = ctx.client.post(url).json(&data).send().await?;
    match res.error_for_status_ref() {
        Ok(_) => Ok(()),
        Err(_) => {
            let text = res.text().await?;
            bail!(text);
        }
    }
}

pub async fn fetch_key(ctx: &Context, mnemonic: &String) -> Result<String> {
    let path = format!("/api/v1/dataset/{}/key", mnemonic);
    let url = ctx.url.join(&path)?;

    let mut data = HashMap::new();
    data.insert("keyHash", ctx.key()?.fingerprint()?);
    let res = ctx.client.post(url).json(&data).send().await?;
    match res.error_for_status_ref() {
        Ok(_) => {
            let key = res.text().await?;
            Ok(key)
        }
        Err(_) => {
            bail!(res.text().await?)
        }
    }
}

pub async fn fetch_chunk(ctx: &Context, mnemonic: &String, hash: &String) -> Result<Vec<u8>> {
    let path = format!("/api/v1/dataset/{}/chunk/{}", mnemonic, hash);
    let url = ctx.url.join(&path)?;

    let res = ctx.client.get(url).send().await?.error_for_status()?;
    let data = res.bytes().await?;
    let enc = Vec::from_iter(data);

    Ok(enc)
}
