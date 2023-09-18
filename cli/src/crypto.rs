use std::path::PathBuf;

use crate::config::Context;
use anyhow::bail;
use anyhow::Result;
use openssl::pkey::Private;
use openssl::rsa::Rsa;
use openssl::symm::decrypt;
use openssl::symm::Cipher;
use sha2::{Digest, Sha256};
use std::fs::{canonicalize, File};
use std::io::{Read, Write};

use openssl::{encrypt::Decrypter, hash::MessageDigest, pkey::PKey, rsa::Padding};

use crate::api::Chunk;
use base64::{engine::general_purpose, Engine as _};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Jwk {
    kty: String,
    n: String,
    e: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct RootKeys {
    #[serde(rename = "rootKeys")]
    root_keys: Vec<Jwk>,
}

pub fn read_private_key(key_file: &String) -> Result<Rsa<Private>> {
    let rel_path = PathBuf::from(key_file);
    let path = canonicalize(&rel_path)?;
    if !path.is_file() {
        bail!("{} does not exist or is not readable", path.display());
    }
    let mut pem_data = Vec::new();
    let mut file = File::open(path)?;
    file.read_to_end(&mut pem_data)?;

    let key = match Rsa::private_key_from_pem(&pem_data) {
        Ok(f) => f,
        Err(_) => bail!("Invalid key file"),
    };
    Ok(key)
}
pub fn fingerprint(key: &Rsa<Private>) -> Result<String> {
    let buffer = key.public_key_to_der()?;
    let fingerprint = sha256(&buffer);
    Ok(fingerprint)
}

pub fn decode_base64(value: &String) -> Result<Vec<u8>> {
    let decoder = general_purpose::STANDARD;
    let data = decoder.decode(value)?;
    return Ok(data);
}
pub fn decode_base64_url(value: &String) -> Result<Vec<u8>> {
    let decoder = general_purpose::URL_SAFE_NO_PAD;
    let data = decoder.decode(value)?;
    return Ok(data);
}

pub fn encode_base64(value: &Vec<u8>) -> String {
    let encoder = general_purpose::STANDARD;
    encoder.encode(value)
}
pub fn encode_base64_url(value: &Vec<u8>) -> String {
    let encoder = general_purpose::URL_SAFE_NO_PAD;
    encoder.encode(value)
}
pub fn sha256(bytes: &Vec<u8>) -> String {
    let mut hasher = Sha256::new();
    hasher.update(&bytes);
    let result = hasher.finalize().to_vec();
    let hash = encode_base64(&result);
    return hash;
}

pub fn decrypt_key(private_key: Rsa<Private>, key: &String) -> Result<Vec<u8>> {
    let data = decode_base64(key)?;
    let pkey = PKey::from_rsa(private_key)?;
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
    let iv = decode_base64(&chunk.iv)?;
    let decrypted = decrypt(cipher, &key, Some(&iv), data)?;
    Ok(decrypted)
}

pub fn generate_keypair(key_file: &Option<String>) -> Result<()> {
    let path = match key_file {
        Some(s) => PathBuf::from(s),
        None => PathBuf::from("./dabihRootKey.pem"),
    };

    if path.exists() {
        bail!(
            "File {} already exists. Refusing to overwrite.",
            path.display()
        );
    }
    let mut file = File::create(&path)?;

    let bits = 4096;
    let key = Rsa::generate(bits)?;

    let pem = key.private_key_to_pem()?;
    file.write_all(&pem)?;

    let n = encode_base64_url(&key.n().to_vec());
    let e = encode_base64_url(&key.e().to_vec());

    let jwk = Jwk {
        kty: "RSA".to_string(),
        n,
        e,
    };
    let root_keys = RootKeys {
        root_keys: vec![jwk],
    };

    let yaml = serde_yaml::to_string(&root_keys)?;
    println!(
        "Successfully generated a new root key for dabih. Add it to your config like this: \n"
    );
    println!("{}\n", yaml);
    println!("Keep the file {} in a safe place!", path.display());

    Ok(())
}
