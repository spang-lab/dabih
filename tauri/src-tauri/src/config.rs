use crate::Result;
use reqwest::{header, Client};
use serde::{Deserialize, Serialize};
use std::fmt;
use std::fs;
use std::path::PathBuf;
use url::Url;

#[derive(Serialize, Deserialize, Debug)]
pub struct ConfigFile {
    #[serde(rename = "baseUrl")]
    pub url: String,
    pub token: String,
    pub name: Option<String>,
}

#[derive(Debug, Clone)]
pub struct Config {
    pub url: Url,
    pub token: String,
    pub client: Client,
    pub name: Option<String>,
    pub config_path: PathBuf,
}
impl fmt::Display for Config {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "Config: {{\n  config_file:{}\n  url: {}\n  token: {}\n}}",
            self.config_path.display(),
            self.url,
            self.token,
        )
    }
}

impl Config {
    pub fn from(path: PathBuf) -> Result<Config> {
        let file = fs::File::open(&path)?;
        let ConfigFile { url, token, name } = serde_json::from_reader(file)?;
        let authorization = format!("Bearer dabih_{}", token);
        let mut headers = header::HeaderMap::new();
        headers.insert(
            header::AUTHORIZATION,
            header::HeaderValue::from_str(&authorization)?,
        );
        let client = Client::builder().default_headers(headers).build()?;
        Ok(Config {
            url: Url::parse(&url)?,
            token,
            client,
            name,
            config_path: path,
        })
    }
}
