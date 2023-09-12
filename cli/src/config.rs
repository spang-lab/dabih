use anyhow::{bail, Result};
use openssl::pkey::Private;
use openssl::rsa::Rsa;
use reqwest::{header, Client};
use serde::{Deserialize, Serialize};
use std::env;
use std::fmt;
use std::fs;
use std::io::Read;
use std::io::Write;
use std::path::PathBuf;
use url::Url;

use crate::crypto::sha256;

pub struct Context {
    pub url: Url,
    pub token: String,
    pub private_key: Rsa<Private>,
    pub public_key: String,
    pub fingerprint: String,
    pub client: Client,
    pub config_path: PathBuf,
}
impl fmt::Display for Context {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "Config: {{\n  config_file:{}\n  url: {}\n  token: {}\n  key_fingerprint: {}\n  public_key: \n{}\n}}",
            self.config_path.display(),
            self.url,
            self.token,
            self.fingerprint,
            self.public_key,
        )
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub url: String,
    pub token: String,
    #[serde(rename = "privateKey")]
    pub private_key: String,
}
impl fmt::Display for Config {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "{{\n  url: {}\n  token: {}\n  private_key: ******\n}}",
            self.url, self.token
        )
    }
}

fn read_path() -> Result<PathBuf> {
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

pub fn get_path() -> Result<PathBuf> {
    let path = read_path()?;
    if !path.exists() {
        bail!("Config file {} does not exist.", path.display())
    }
    Ok(path)
}

pub fn create_client(token: String) -> Result<Client> {
    let authorization = format!("Bearer dabih_{}", token);
    let mut headers = header::HeaderMap::new();
    headers.insert(
        header::AUTHORIZATION,
        header::HeaderValue::from_str(&authorization)?,
    );
    let client = Client::builder().default_headers(headers).build()?;
    Ok(client)
}

pub fn read_private_key(key_file: String) -> Result<Rsa<Private>> {
    let rel_path = PathBuf::from(key_file);
    let path = fs::canonicalize(&rel_path)?;
    let mut pem_data = Vec::new();
    let mut file = fs::File::open(path)?;
    file.read_to_end(&mut pem_data)?;

    let key = match Rsa::private_key_from_pem(&pem_data) {
        Ok(f) => f,
        Err(_) => bail!("Invalid key file"),
    };
    Ok(key)

    // let string = String::from_utf8(pem_data)?;
    // Ok(string)
}

pub fn read_context() -> Result<Context> {
    let path = get_path()?;
    let file = match fs::File::open(&path) {
        Ok(f) => f,
        Err(_) => bail!("Failed to open config file {}", path.to_string_lossy()),
    };
    let Config {
        url,
        token,
        private_key,
    } = serde_yaml::from_reader(file)?;

    let pem_data = private_key.as_bytes();
    let key = Rsa::private_key_from_pem(pem_data)?;
    let buffer = key.public_key_to_der()?;

    let buffer2 = key.public_key_to_pem_pkcs1()?;
    let public_key = String::from_utf8(buffer2)?;

    let fingerprint = sha256(&buffer);

    let client = create_client(token.clone())?;
    return Ok(Context {
        url: Url::parse(&url)?,
        token,
        private_key: key,
        fingerprint,
        client,
        config_path: path,
        public_key,
    });
}

pub fn write_config(config: &Config) -> Result<()> {
    let yaml = serde_yaml::to_string(config)?;
    let path = read_path()?;

    if let Some(parent_dir) = &path.parent() {
        fs::create_dir_all(parent_dir)?;
    }
    let mut file = fs::File::create(&path)?;
    file.write_all(yaml.as_bytes())?;
    Ok(())
}
