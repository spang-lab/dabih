use std::{fs::File, io::Read, path::PathBuf};

use base64ct::{Base64Url, Encoding};
use rsa::{RsaPrivateKey, pkcs1::EncodeRsaPrivateKey, pkcs8::DecodePrivateKey};
use sha2::Digest;

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
    pub fn hash(&self) -> Result<String> {
        let data = self.key.to_pkcs1_der()?;
        let bytes = data.to_bytes();
        let digest = sha2::Sha256::digest(&bytes);
        let base64 = Base64Url::encode_string(&digest);
        return Ok(base64);
    }
}
