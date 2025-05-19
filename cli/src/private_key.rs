use std::{fs::File, io::Read, path::PathBuf};

use rsa::{RsaPrivateKey, pkcs8::DecodePrivateKey};

use crate::error::Result;

#[derive(Debug)]
pub struct PrivateKey {
    key: RsaPrivateKey,
}
impl PrivateKey {
    pub fn from(path: PathBuf) -> Result<Self> {
        let mut file = File::open(path)?;
        let mut content = String::new();
        file.read_to_string(&mut content)?;
        let key = RsaPrivateKey::from_pkcs8_pem(&content)?;
        Ok(Self { key: key })
    }
}
