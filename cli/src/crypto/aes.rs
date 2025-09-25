use aes::cipher::{BlockDecryptMut, KeyIvInit};

use aes::cipher::block_padding::Pkcs7;

use crate::error::{CliError, Result};
use base64ct::{Base64UrlUnpadded, Encoding};

type Aes256CbcDec = cbc::Decryptor<aes::Aes256>;

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
