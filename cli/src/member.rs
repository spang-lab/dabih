use crate::config::Context;
use anyhow::Result;

use crate::api;
use crate::crypto;

pub async fn add_member(ctx: &Context, mnemonic: &String, sub: &String, write: bool) -> Result<()> {
    let encrypted_key = api::fetch_key(ctx, mnemonic).await?;
    let private_key = ctx.key()?;
    let key = private_key.decrypt_key(&encrypted_key)?;
    let encoded_key = crypto::encode_base64(&key);
    api::add_member(ctx, mnemonic, sub, &encoded_key).await?;
    if write {
        let permission = "write".to_owned();
        api::set_member_access(ctx, mnemonic, sub, &permission).await?;
    }
    Ok(())
}
