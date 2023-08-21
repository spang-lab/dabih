use crate::config::Context;
use anyhow::Result;
use openssl::symm::decrypt;
use openssl::symm::Cipher;

use openssl::{base64, encrypt::Decrypter, hash::MessageDigest, pkey::PKey, rsa::Padding};

use crate::api::Chunk;

pub fn decrypt_key(ctx: &Context, key: &String) -> Result<Vec<u8>> {
    let data = base64::decode_block(key)?;
    let pkey = PKey::from_rsa(ctx.private_key.clone())?;
    let mut decrypter = Decrypter::new(&pkey)?;
    decrypter.set_rsa_padding(Padding::PKCS1_OAEP)?;
    decrypter.set_rsa_oaep_md(MessageDigest::sha256())?;

    let len = decrypter.decrypt_len(&data)?;
    let mut decrypted = vec![0u8; len];

    let dlen = decrypter.decrypt(&data, &mut decrypted)?;
    decrypted.truncate(dlen);

    Ok(decrypted)
}

pub fn decrypt_chunk(chunk: &Chunk, key: &Vec<u8>, data: &Vec<u8>) -> Result<Vec<u8>> {
    let cipher = Cipher::aes_256_cbc();
    let iv = base64::decode_block(&chunk.iv)?;
    let decrypted = decrypt(cipher, &key, Some(&iv), data)?;
    Ok(decrypted)
}
