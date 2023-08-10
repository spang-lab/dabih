use std::collections::HashMap;

use anyhow::{bail, Result};

use crate::config::Config;
use crate::crypto::CryptoKey;
use reqwest::{header, Client};
use serde::Deserialize;
use serde_json;
use url::Url;

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

fn create_client(config: &Config) -> Result<Client> {
    let authorization = format!("Bearer dabih_{}", config.token);
    let mut headers = header::HeaderMap::new();
    headers.insert(
        header::AUTHORIZATION,
        header::HeaderValue::from_str(&authorization)?,
    );
    let client = Client::builder().default_headers(headers).build()?;
    Ok(client)
}

async fn check_api(config: &Config) -> Result<()> {
    let url = Url::parse(&config.url)?;
    let healthy_url = url.join("/api/v1/healthy")?;
    let res = reqwest::get(healthy_url).await?;
    if !res.status().is_success() {
        bail!("Failed to contact api endpoint {}", config.url)
    }
    Ok(())
}

async fn get_user(config: &Config, client: &Client) -> Result<()> {
    let url = Url::parse(&config.url)?;
    let token_url = url.join("/api/v1/token")?;
    let res = client.post(token_url).send().await?;

    let user: User = res.error_for_status()?.json().await?;
    println!("Successfully authenticated as {}", user.name);
    Ok(())
}

pub async fn check_key(config: &Config, key: &CryptoKey) -> Result<()> {
    check_api(config).await?;
    let client = create_client(config)?;
    get_user(config, &client).await?;

    let url = Url::parse(&config.url)?;
    let key_url = url.join("/api/v1/key/check")?;

    let mut data = HashMap::new();
    data.insert("keyHash", key.fingerprint.clone());
    let res = client.post(key_url).json(&data).send().await?;
    let status: KeyStatus = res.json().await?;
    let KeyStatus { error, valid } = status;

    if let Some(err) = error {
        bail!(err)
    }

    if !valid {
        bail!("Invalid key")
    }
    println!("Key with fingerprint {} is valid", &key.fingerprint);
    Ok(())
}
