use clap::{Args, Parser, Subcommand};

use anyhow::{Ok, Result};
mod api;
mod config;
mod crypto;
mod init;
mod upload;

/// Dabih Command line Interface
#[derive(Parser)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Initialize the dabih configuration
    Init(InitArgs),
    /// Upload files to dabih
    Upload(UploadArgs),
    /// Show the Configuration and check if it is valid
    Config,
}

#[derive(Args)]
struct InitArgs {
    #[arg(value_name = "privateKeyFile")]
    key_file: String,
}

#[derive(Args)]
struct UploadArgs {
    /// The files that should be uploaded to dabih, this can also be a glob pattern
    paths: Vec<String>,
    /// If set, all files in a folder will be uploaded seperately
    #[arg(short, long)]
    recursive: bool,

    /// If set, folders will be gziped and then uploaded as single file.
    #[arg(short, long)]
    zip: bool,
    /// Max number of files that should be uploaded, set to -1 for unlimited.
    #[arg(short, long, default_value_t = 10)]
    limit: i64,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    // You can check for the existence of subcommands, and if found use their
    // matches just as you would the top level cmd
    match &cli.command {
        Commands::Init(args) => {
            init::init(args.key_file.clone()).await?;
        }
        Commands::Config => {
            let ctx = config::read_context()?;
            api::check_key(&ctx).await?;
        }
        Commands::Upload(args) => {
            let UploadArgs {
                paths,
                recursive,
                zip,
                limit,
            } = args;
            let files = upload::resolve(paths.clone(), *recursive, *zip, *limit)?;
            let ctx = config::read_context()?;
            for file in files {
                upload::upload(&ctx, file).await?;
            }
        }
    };
    Ok(())
}
