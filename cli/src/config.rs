use std::fs::File;
use std::path::{self, PathBuf};

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
    pub config: Config,
    pub private_key: Option<PrivateKey>,
    pub openapi_config: Configuration,
}

fn find_pem_files(path: PathBuf) -> Result<Vec<PathBuf>> {
    let mut pem_files = Vec::new();
    for entry in path.read_dir()? {
        let entry = entry?;
        if entry.path().extension() == Some(std::ffi::OsStr::new("pem")) {
            pem_files.push(entry.path());
        }
    }
    Ok(pem_files)
}

impl Context {
    pub fn from(path: PathBuf) -> Result<Self> {
        if !path.is_dir() {
            return Err(CliError::ConfigDirNotFound);
        }
        let config_path = path.join("config.yaml");
        let config_file = File::open(config_path)?;
        let config: Config = serde_yaml::from_reader(config_file)?;

        let openapi_config = Configuration {
            base_path: config.url.clone(),
            user_agent: Some("dabih-cli".to_string()),
            bearer_access_token: Some(config.token.clone()),
            ..Default::default()
        };
        let private_key = None;
        Ok(Self {
            config,
            private_key,
            openapi_config,
        })
    }
}
