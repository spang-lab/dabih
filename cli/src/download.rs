use anyhow::Result;

use crate::api;
use crate::config::Context;

pub async fn resolve_mnemonics(ctx: &Context, mnemonics: &Vec<String>) -> Result<()> {
    for mnemonic in mnemonics {
        api::fetch_dataset(ctx, mnemonic).await?;
    }
    dbg!(mnemonics);
    Ok(())
}
