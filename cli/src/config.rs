use std::fs::File;
use std::path::PathBuf;

use serde::{Deserialize, Serialize};

use crate::api::types::UserResponse;
use crate::api::{self, Client};
use crate::crypto::PrivateKey;
use crate::error::{CliError, Result};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Config {
    pub url: String,
    pub token: String,
}

#[derive(Debug, Clone)]
pub struct Context {
    verbose: u8,
    quiet: bool,
    path: PathBuf,
    user: Option<UserResponse>,
    private_key: Option<PrivateKey>,
    client: Client,
}

fn find_key(path: &PathBuf, fingerprints: Vec<String>) -> Result<Option<PrivateKey>> {
    for entry in path.read_dir()? {
        let entry = entry?;
        if entry.path().extension() == Some(std::ffi::OsStr::new("pem")) {
            let key = match PrivateKey::from(entry.path()) {
                Ok(k) => k,
                Err(_) => {
                    println!("Failed to read key from {:?}. Skipping", entry.path());
                    continue;
                }
            };
            let fingerprint = key.hash()?;
            if fingerprints.contains(&fingerprint) {
                return Ok(Some(key));
            }
        }
    }
    Ok(None)
}

fn normalize_url(url: &str) -> String {
    let mut normalized_url = url.to_string();
    if normalized_url.ends_with('/') {
        normalized_url.pop();
    }
    if !normalized_url.ends_with("/api/v1") {
        normalized_url.push_str("/api/v1");
    }
    normalized_url
}

impl Context {
    pub fn new(url: String, token: String, path: PathBuf) -> Result<Self> {
        let base_path = normalize_url(&url);
        let timeout = std::time::Duration::from_secs(5);
        let mut headers = reqwest::header::HeaderMap::new();

        headers.insert(
            reqwest::header::AUTHORIZATION,
            format!("Bearer {}", token).parse().unwrap(),
        );

        let c = reqwest::Client::builder()
            .user_agent("dabih-cli")
            .timeout(timeout)
            .default_headers(headers)
            .build()?;

        let client = api::Client::new_with_client(&base_path, c);

        Ok(Self {
            verbose: 0,
            quiet: false,
            path,
            user: None,
            private_key: None,
            client,
        })
    }

    pub fn from(path: PathBuf) -> Result<Self> {
        if !path.is_dir() {
            return Err(CliError::ConfigDirNotFound);
        }
        let config_path = path.join("config.yaml");
        let config_file = File::open(config_path)?;
        let config: Config = serde_yaml::from_reader(config_file)?;

        Self::new(config.url, config.token, path)
    }
    pub fn api(&self) -> &api::Client {
        &self.client
    }

    pub fn user(&self) -> Option<&UserResponse> {
        self.user.as_ref()
    }
    pub fn private_key(&self) -> Option<&PrivateKey> {
        self.private_key.as_ref()
    }

    pub fn set_verbose(&mut self, verbose: u8, quiet: bool) {
        self.quiet = quiet;
        self.verbose = verbose;
    }

    pub async fn init(&mut self) -> Result<()> {
        let resp = self.client.me().await?;

        match resp.as_ref() {
            Some(user) => {
                self.user = Some(user.clone());
                let fingerprints = user
                    .keys
                    .iter()
                    .map(|key| key.hash.clone())
                    .collect::<Vec<_>>();
                let key = find_key(&self.path, fingerprints)?;
                self.private_key = key;
                return Ok(());
            }
            None => {
                self.client.healthy().await?;
                return Err(CliError::AuthenticationError);
            }
        }
    }
}

#[tokio::test]
async fn test_invalid_url() -> Result<()> {
    let url = "http://non.existing.host:3000".to_string();
    let mut ctx = Context::new(url, "token".to_string(), PathBuf::new())?;
    let result = ctx.init().await;
    dbg!(&result);
    assert!(result.is_err());
    assert!(matches!(result, Err(CliError::ConnectionError(_))));
    Ok(())
}
#[tokio::test]
async fn test_invalid_token() -> Result<()> {
    let mut ctx = Context::new(
        "http://localhost:3001".to_string(),
        "invalid_token".to_string(),
        PathBuf::new(),
    )?;
    let result = ctx.init().await;
    dbg!(&result);
    //is AuthenticationError
    assert!(result.is_err());
    assert!(matches!(result, Err(CliError::AuthenticationError)));

    Ok(())
}
