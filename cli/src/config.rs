use anyhow::{bail, Result};
use reqwest::{header, Client};
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use url::Url;

use crate::crypto::Key;

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub url: String,
    pub token: String,
}

pub struct Context {
    pub url: Url,
    pub token: String,
    pub key: Option<Key>,
    pub client: Client,
}

impl Context {
    fn get_path() -> Result<PathBuf> {
        let filename = "config.yaml";
        let key = "XDG_CONFIG_HOME";
        let config_folder = match env::var(key) {
            Ok(v) => PathBuf::from(v).join("dabih"),
            Err(_) => match home::home_dir() {
                Some(v) => v.join(".dabih"),
                None => bail!("Could not get home dir"),
            },
        };
        let path = config_folder.join(filename);
        Ok(path)
    }
    pub fn from(url: String, token: String) -> Result<Context> {
        let authorization = format!("Bearer dabih_{}", token);
        let mut headers = header::HeaderMap::new();
        headers.insert(
            header::AUTHORIZATION,
            header::HeaderValue::from_str(&authorization)?,
        );
        let client = Client::builder().default_headers(headers).build()?;

        Ok(Context {
            url: Url::parse(&url)?,
            token,
            key: None,
            client,
        })
    }
    pub fn read_without_key() -> Result<Context> {
        let path = Self::get_path()?;
        if !path.exists() {
            bail!("Config file {} does not exist.", path.display())
        }
        let file = match fs::File::open(&path) {
            Ok(f) => f,
            Err(_) => bail!("Failed to open config file {}", path.to_string_lossy()),
        };
        let Config { url, token } = serde_yaml::from_reader(file)?;
        Self::from(url, token)
    }
    pub fn read() -> Result<Context> {
        let mut ctx = Self::read_without_key()?;
        let path = Self::get_path()?;
        let folder = match path.parent() {
            Some(p) => PathBuf::from(p),
            None => bail!("Could not get parent folder of {}", path.display()),
        };
        let key = Key::find_in(folder)?;
        ctx.key = key;
        return Ok(ctx);
    }
    pub fn build(url: String, token: String, key_file: Option<String>) -> Result<Context> {
        let mut ctx = Self::from(url, token)?;
        if let Some(kfile) = key_file {
            let path = PathBuf::from(kfile);
            let key = Key::from(path)?;
            ctx.key = Some(key);
        }
        Ok(ctx)
    }
    pub fn key(&self) -> Result<Key> {
        match self.key.clone() {
            Some(k) => Ok(k),
            None => bail!("Private Key is required but not in config folder"),
        }
    }

    pub fn write(&self) -> Result<()> {
        let config = Config {
            url: self.url.clone().into(),
            token: self.token.clone(),
        };
        let yaml = serde_yaml::to_string(&config)?;
        let path = Self::get_path()?;

        if let Some(parent_dir) = &path.parent() {
            fs::create_dir_all(parent_dir)?;
        }
        let mut file = fs::File::create(&path)?;
        file.write_all(yaml.as_bytes())?;

        if let Some(key) = self.key.clone() {
            let folder = match path.parent() {
                Some(p) => PathBuf::from(p),
                None => bail!("Could not get parent folder of {}", path.display()),
            };
            key.write_to(folder)?;
        }

        Ok(())
    }
}
