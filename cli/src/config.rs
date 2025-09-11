use std::fs::File;
use std::path::{self, PathBuf};

use openapi::models::UserResponse;
use serde::{Deserialize, Serialize};

use crate::api::Api;
use crate::error::{CliError, Result};
use crate::private_key::PrivateKey;
use openapi::apis::configuration::Configuration;

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
    api: Api,
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
    pub fn new(url: String, token: String) -> Self {
        let base_path = normalize_url(&url);
        let openapi_config = Configuration {
            base_path: base_path.clone(),
            user_agent: Some("dabih-cli".to_string()),
            bearer_access_token: Some(token.clone()),
            ..Default::default()
        };
        let api = Api::new(openapi_config);
        Self {
            verbose: 0,
            quiet: false,
            path: path::PathBuf::new(),
            user: None,
            private_key: None,
            api,
        }
    }

    pub fn from(path: PathBuf) -> Result<Self> {
        if !path.is_dir() {
            return Err(CliError::ConfigDirNotFound);
        }
        let config_path = path.join("config.yaml");
        let config_file = File::open(config_path)?;
        let config: Config = serde_yaml::from_reader(config_file)?;
        let url = normalize_url(&config.url);

        let openapi_config = Configuration {
            base_path: url,
            user_agent: Some("dabih-cli".to_string()),
            bearer_access_token: Some(config.token.clone()),
            ..Default::default()
        };
        let api = Api::new(openapi_config);

        Ok(Self {
            verbose: 0,
            quiet: false,
            path,
            user: None,
            private_key: None,
            api,
        })
    }
    pub fn api(&self) -> &Api {
        &self.api
    }

    pub fn openapi(&self) -> &Configuration {
        self.api.config()
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
        match self.api().user().me().await {
            Ok(user) => {
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
            Err(e) => {
                self.api().util().healthy().await?;
                return Err(e);
            }
        }
    }
}

#[tokio::test]
async fn test_invalid_url() -> Result<()> {
    let url = "http://non.existing.host:3000".to_string();
    let mut ctx = Context::new(url, "token".to_string());
    let result = ctx.init().await;
    dbg!(&result);
    assert!(result.is_err());
    assert!(matches!(result, Err(CliError::ConnectionError { url: _ })));
    Ok(())
}
#[tokio::test]
async fn test_invalid_token() -> Result<()> {
    let mut ctx = Context::new(
        "http://localhost:3001".to_string(),
        "invalid_token".to_string(),
    );
    dbg!(&ctx);
    let result = ctx.init().await;
    dbg!(&result);
    //is AuthenticationError
    assert!(result.is_err());
    assert!(matches!(result, Err(CliError::AuthenticationError)));

    Ok(())
}
