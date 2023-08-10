use anyhow::Result;
use openssl::base64;
use openssl::pkey::Private;
use openssl::rsa::Rsa;
use openssl::sha::sha256;

pub struct CryptoKey {
    pub key: Rsa<Private>,
    pub fingerprint: String,
}

impl CryptoKey {
    pub fn from(pem: String) -> Result<CryptoKey> {
        let bytes = pem.as_bytes();
        let key = Rsa::private_key_from_pem(bytes)?;
        let buffer = key.public_key_to_der()?;
        let hash = sha256(&buffer);
        let fingerprint = base64::encode_block(&hash);
        Ok(CryptoKey { key, fingerprint })
    }
}
