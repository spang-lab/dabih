use crate::api::ApiHelpers;
use crate::config::Context;
use crate::error::Result;
use crate::fs::InodeWriter;
use clap::Args;
use tracing::debug;

/// Download and print a file to stdout
#[derive(Args, Debug)]
pub struct Cat {
    pub mnemonic: String,
}

pub async fn run(ctx: Context, args: Cat) -> Result<()> {
    let private_key = match ctx.private_key() {
        Some(k) => k,
        None => {
            debug!("No private key set, cannot download encrypted files");
            return Err(crate::error::CliError::NoPrivateKey);
        }
    };
    let inode = ctx.api().file_info(&args.mnemonic).await?.into_inner();
    let key = private_key.extract_key(&inode)?;
    let stdout = std::io::stdout();
    let mut writer = InodeWriter::from_writer(stdout, inode, key)?;

    while let Some((uid, chunk)) = writer.read_chunk() {
        debug!("Downloading chunk {}-{}", chunk.start, chunk.end);
        let chunk_data = ctx.api().download_chunk_h(uid, &chunk.hash).await?;
        writer.write_chunk(chunk_data)?;
    }
    writer.close()?;

    Ok(())
}
