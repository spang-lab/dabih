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
    pub name: Option<String>,
}

pub struct Context {
    pub url: Url,
    pub token: String,
    pub key: Option<Key>,
    pub client: Client,
    pub path: PathBuf,
    pub name: Option<String>,
}

impl Context {
    pub fn default_path() -> Result<PathBuf> {
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
    pub fn from(
        path: PathBuf,
        url: String,
        token: String,
        name: Option<String>,
    ) -> Result<Context> {
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
            path,
            name,
        })
    }
    pub fn read_without_key(path: PathBuf) -> Result<Context> {
        if !path.exists() {
            bail!("Config file {} does not exist.", path.display())
        }
        let file = match fs::File::open(&path) {
            Ok(f) => f,
            Err(_) => bail!("Failed to open config file {}", path.to_string_lossy()),
        };
        let Config { url, token, name } = serde_yaml::from_reader(file)?;
        Self::from(path, url, token, name)
    }
    pub fn read(path: PathBuf) -> Result<Context> {
        let mut ctx = Self::read_without_key(path.clone())?;
        let folder = match path.parent() {
            Some(p) => PathBuf::from(p),
            None => bail!("Could not get parent folder of {}", path.display()),
        };
        let key = Key::find_in(folder)?;
        ctx.key = key;
        return Ok(ctx);
    }
    pub fn build(
        path: PathBuf,
        url: String,
        token: String,
        key_file: Option<String>,
        name: Option<String>,
    ) -> Result<Context> {
        let mut ctx = Self::from(path, url, token, name)?;
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
            name: self.name.clone(),
        };
        let yaml = serde_yaml::to_string(&config)?;

        if let Some(parent_dir) = &self.path.parent() {
            fs::create_dir_all(parent_dir)?;
        }
        let mut file = fs::File::create(&self.path)?;
        file.write_all(yaml.as_bytes())?;

        if let Some(key) = self.key.clone() {
            let folder = match &self.path.parent() {
                Some(p) => PathBuf::from(p),
                None => bail!("Could not get parent folder of {}", self.path.display()),
            };
            key.write_to(folder)?;
        }

        Ok(())
    }
}
