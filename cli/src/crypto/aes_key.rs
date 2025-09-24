use aes::cipher::{BlockDecrypt, BlockDecryptMut, KeyIvInit};

use aes::cipher::block_padding::Pkcs7;

use crate::error::{CliError, Result};
use base64ct::{Base64UrlUnpadded, Encoding};

type Aes256CbcDec = cbc::Decryptor<aes::Aes256>;

#[derive(Debug, Clone)]
pub struct AesKey {
    key: [u8; 32],
}

pub fn decrypt_buffer(buf: &mut [u8], key: &[u8], iv: &String) -> Result<()> {
    let key_bytes: [u8; 32] = key.try_into().map_err(|_| {
        CliError::UnexpectedError("Invalid AES key length, must be 32 bytes".to_string())
    })?;
    let iv_bytes: [u8; 16] = Base64UrlUnpadded::decode_vec(iv)
        .map_err(|e| CliError::UnexpectedError(format!("Invalid IV: {}", e)))?
        .try_into()
        .map_err(|_| {
            CliError::UnexpectedError("Invalid IV length, must be 16 bytes".to_string())
        })?;
    let decryptor = Aes256CbcDec::new(&key_bytes.into(), &iv_bytes.into());
    decryptor
        .decrypt_padded_mut::<Pkcs7>(buf)
        .map_err(|e| CliError::UnexpectedError(format!("Decryption failed: {}", e)))?;
    Ok(())
}

impl AesKey {
    pub fn from(key: &[u8]) -> Result<Self> {
        if key.len() != 32 {
            return Err(CliError::UnexpectedError(
                "Invalid AES key length".to_string(),
            ));
        }
        let mut key_data = [0u8; 32];
        key_data.copy_from_slice(&key[0..32]);
        Ok(Self { key: key_data })
    }

    pub fn hash(&self) -> String {
        use sha2::Digest;
        let digest = sha2::Sha256::digest(&self.key);
        Base64UrlUnpadded::encode_string(&digest)
    }

    pub fn decrypt(&self, data: &mut [u8], iv_str: &String) -> Result<()> {
        let mut iv: [u8; 16] = [0; 16];
        let iv_vec = Base64UrlUnpadded::decode_vec(iv_str)
            .map_err(|e| CliError::UnexpectedError(format!("Invalid IV: {}", e)))?;
        iv.copy_from_slice(&iv_vec[0..16]);

        let decryptor = Aes256CbcDec::new(&self.key.into(), &iv.into());
        decryptor.decrypt_padded_mut::<Pkcs7>(data).unwrap();

        Ok(())
    }
}
