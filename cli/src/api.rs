use std::collections::HashMap;

use anyhow::{bail, Result};

use crate::config::Context;
use reqwest::header::{self, HeaderMap, HeaderName, HeaderValue};
use reqwest::multipart::{Form, Part};
use serde::Deserialize;

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
struct Upload {
    pub mnemonic: String,
}

#[derive(Debug, Deserialize)]
struct UploadResult {
    pub hash: String,
}

async fn check_api(ctx: &Context) -> Result<()> {
    let healthy_url = ctx.url.join("/api/v1/healthy")?;
    let res = reqwest::get(healthy_url).await?;
    if !res.status().is_success() {
        bail!("Failed to contact api endpoint {}", ctx.url)
    }
    Ok(())
}

async fn get_user(ctx: &Context) -> Result<()> {
    let token_url = ctx.url.join("/api/v1/token")?;
    let res = ctx.client.post(token_url).send().await?;

    let user: User = res.error_for_status()?.json().await?;
    println!(
        "Successfully authenticated as {}<{}> (id:{})",
        user.name, user.email, user.sub
    );
    Ok(())
}

pub async fn check_key(ctx: &Context) -> Result<()> {
    check_api(ctx).await?;
    get_user(ctx).await?;

    let key_url = ctx.url.join("/api/v1/key/check")?;

    let mut data = HashMap::new();
    data.insert("keyHash", ctx.fingerprint.clone());
    let res = ctx.client.post(key_url).json(&data).send().await?;
    let status: KeyStatus = res.json().await?;
    let KeyStatus { error, valid } = status;

    if let Some(err) = error {
        bail!(err)
    }

    if !valid {
        bail!("Invalid key")
    }
    println!("Key with fingerprint {} is valid", &ctx.fingerprint);
    Ok(())
}

pub async fn upload_start(ctx: &Context, name: String) -> Result<String> {
    let url = ctx.url.join("/api/v1/upload/start")?;
    let mut data = HashMap::new();
    data.insert("name", name);

    let res = ctx.client.post(url).json(&data).send().await?;
    let Upload { mnemonic } = res.json().await?;
    Ok(mnemonic)
}

pub async fn upload_chunk(
    ctx: &Context,
    mnemonic: String,
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

    let url = ctx.url.join("/api/v1/upload/")?.join(&mnemonic)?;
    ctx.client
        .put(url)
        .multipart(form)
        .headers(headers)
        .send()
        .await?;
    Ok(())
}

pub async fn upload_finish(ctx: &Context, mnemonic: String) -> Result<String> {
    let url = ctx.url.join("/api/v1/upload/finish/")?.join(&mnemonic)?;
    let res = ctx.client.post(url).send().await?;
    let UploadResult { hash } = res.json().await?;
    Ok(hash)
}
