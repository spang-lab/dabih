use anyhow::{bail, Result};
use openssl::rsa::Rsa;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::io::Read;
use std::io::Write;
use std::path::PathBuf;

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    pub url: String,
    pub token: String,
    #[serde(rename = "privateKey")]
    pub private_key: String,
}

fn get_path() -> Result<PathBuf> {
    let filename = "config.yaml";
    let key = "XDG_CONFIG_HOME";
    let config_folder = match env::var(key) {
        Ok(v) => PathBuf::from(v).join("dabih"),
        Err(_) => match env::home_dir() {
            Some(v) => v.join(".dabih"),
            None => bail!("Could not get home dir"),
        },
    };
    let path = config_folder.join(filename);
    Ok(path)
}
pub fn read_private_key(key_file: String) -> Result<String> {
    let rel_path = PathBuf::from(key_file);
    let path = fs::canonicalize(&rel_path)?;
    let mut pem_data = Vec::new();
    let mut file = fs::File::open(path)?;
    file.read_to_end(&mut pem_data)?;

    match Rsa::private_key_from_pem(&pem_data) {
        Ok(_) => {}
        Err(_) => bail!("Invalid key file"),
    }

    let string = String::from_utf8(pem_data)?;
    Ok(string)
}

pub fn read_config() -> Result<Config> {
    let path = get_path()?;
    let file = match fs::File::open(&path) {
        Ok(f) => f,
        Err(_) => bail!("No config file {}", path.to_string_lossy()),
    };
    let config: Config = serde_yaml::from_reader(file)?;
    Ok(config)
}

pub fn write_config(config: &Config) -> Result<()> {
    let yaml = serde_yaml::to_string(config)?;
    let path = get_path()?;

    if let Some(parent_dir) = &path.parent() {
        fs::create_dir_all(parent_dir)?;
    }
    let mut file = fs::File::create(&path)?;
    file.write_all(yaml.as_bytes())?;
    Ok(())
}
