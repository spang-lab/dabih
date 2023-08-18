use crate::config::Context;
use anyhow::Result;

use openssl::{base64, encrypt::Decrypter, hash::MessageDigest, pkey::PKey, rsa::Padding};

pub fn decrypt_key(ctx: &Context, key: &String) -> Result<()> {
    let data = base64::decode_block(key)?;
    let pkey = PKey::from_rsa(ctx.private_key.clone())?;
    let mut decrypter = Decrypter::new(&pkey)?;
    decrypter.set_rsa_padding(Padding::PKCS1_OAEP)?;
    decrypter.set_rsa_oaep_md(MessageDigest::sha256())?;

    let len = decrypter.decrypt_len(&data)?;
    let mut decrypted = vec![0u8; len];

    let dlen = decrypter.decrypt(&data, &mut decrypted)?;

    let aes_key = base64::encode_block(&decrypted[..dlen]);
    dbg!(aes_key);
    Ok(())
}
