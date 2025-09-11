use crate::config::Context;
use crate::error::Result;
use crate::uploader::{UploadState, Uploader};
use clap::Args;
use pbr::ProgressBar;

#[derive(Args, Debug)]
pub struct Upload {
    /// The files that should be uploaded to dabih, this can also be a glob pattern
    /// The last argument is the target directory in dabih
    #[arg(required = true, num_args = 2.., name = "PATH")]
    pub paths: Vec<String>,

    /// Set the tag for the dataset
    #[arg(long)]
    pub tag: Option<String>,

    /// If set, upload existing files again, appending a number to the filename
    /// else skip existing files (default)
    #[arg(short, long)]
    pub rename_existing: bool,

    /// If set, chunk size in bytes
    #[arg(short, long, default_value_t = 2 * 1024 * 1024)]
    pub chunk_size: u64,
}

pub async fn run(ctx: Context, args: Upload) -> Result<()> {
    let mut uploader = Uploader::from(&ctx, args)?;
    let mut pb = ProgressBar::new(0);
    loop {
        match uploader.next().await? {
            UploadState::Init => {}
            UploadState::File => {}
            UploadState::Folder => {}
            UploadState::Finish => {
                pb.finish();
                println!("Done.");
            }
            UploadState::Started {
                name,
                mnemonic,
                file_size,
            } => {
                println!("Uploading {} as {}", name, mnemonic);
                pb = ProgressBar::new(file_size);
                let msg = format!("Uploading {} ", mnemonic);
                pb.set_units(pbr::Units::Bytes);
                pb.message(&msg)
            }
            UploadState::Chunk {
                mnemonic: _,
                current,
                total: _,
            } => {
                pb.set(current);
            }
            UploadState::Complete => {
                return Ok(());
            }
            _ => return Ok(()),
        }
    }
}
