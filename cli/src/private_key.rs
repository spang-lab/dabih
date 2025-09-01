use std::{fs::File, io::Read, path::PathBuf};

use base64ct::{Base64UrlUnpadded, Encoding};
use rsa::{RsaPrivateKey, pkcs8::DecodePrivateKey, pkcs8::EncodePublicKey};
use sha2::Digest;

use crate::error::Result;

#[derive(Debug, Clone)]
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
        let pub_key = self.key.to_public_key();
        let data = pub_key.to_public_key_der()?;
        let bytes = data.as_bytes();

        let digest = sha2::Sha256::digest(&bytes);
        let base64 = Base64UrlUnpadded::encode_string(&digest);
        return Ok(base64);
    }
}
