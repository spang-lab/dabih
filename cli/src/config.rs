use std::fs::File;
use std::path::{self, PathBuf};

use openapi::apis::{user_api, util_api};
use serde::{Deserialize, Serialize};

use crate::error::{CliError, Result};
use crate::private_key::PrivateKey;
use openapi::apis::configuration::Configuration;

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub url: String,
    pub token: String,
}

#[derive(Debug)]
pub struct Context {
    config: Config,
    keys: Vec<PathBuf>,
    private_key: Option<PrivateKey>,
    openapi_config: Configuration,
}

fn find_pem_files(path: &PathBuf) -> Result<Vec<PathBuf>> {
    let mut pem_files = Vec::new();
    for entry in path.read_dir()? {
        let entry = entry?;
        if entry.path().extension() == Some(std::ffi::OsStr::new("pem")) {
            pem_files.push(entry.path());
        }
    }
    Ok(pem_files)
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
        Self {
            config: Config { url, token },
            keys: Vec::new(),
            private_key: None,
            openapi_config,
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

        println!("api url: {}", url);

        let openapi_config = Configuration {
            base_path: url,
            user_agent: Some("dabih-cli".to_string()),
            bearer_access_token: Some(config.token.clone()),
            ..Default::default()
        };
        let keys = find_pem_files(&path)?;

        Ok(Self {
            config,
            keys,
            private_key: None,
            openapi_config,
        })
    }
    pub fn openapi(&self) -> &Configuration {
        &self.openapi_config
    }

    pub async fn init(&mut self) -> Result<()> {
        match user_api::me(self.openapi()).await {
            Ok(user) => {
                println!("User: {:?}", user);
            }
            Err(_) => match util_api::healthy(self.openapi()).await {
                Ok(_) => {
                    return Err(CliError::AuthenticationError);
                }
                Err(e) => {
                    println!("Error: {:?}", e);
                    return Err(CliError::ConnectionError {
                        url: self.config.url.clone(),
                    });
                }
            },
        }
        Ok(())
    }
}

#[tokio::test]
async fn test_invalid_url() -> Result<()> {
    let url = "http://non.existing.host:3000".to_string();
    let mut ctx = Context::new(url, "token".to_string());
    let result = ctx.init().await;
    dbg!(&result);
    assert!(result.is_err());
    assert!(matches!(result, Err(CliError::ConnectionError { url })));
    Ok(())
}
#[tokio::test]
async fn test_invalid_token() -> Result<()> {
    let mut ctx = Context::new(
        "http://localhost:3000".to_string(),
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
