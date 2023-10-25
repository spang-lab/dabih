use clap::{Args, CommandFactory, Parser, Subcommand};
use clap_complete::{generate, Shell};
use std::io;

use anyhow::{bail, Result};
mod api;
mod config;
mod crypto;
mod download;
mod hash;
mod init;
mod member;
mod recovery;
mod upload;

use config::Context;

#[cfg(feature = "sftp")]
pub mod sftp;

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
    /// Download a dataset from dabih
    Download(DownloadArgs),
    /// Recover a dataset with a root key
    Recover(RecoverArgs),
    /// Show the Configuration and check if it is valid
    Config,
    /// Generate a (root) RSA key pair for use with dabih.
    Keygen(KeygenArgs),
    /// Search dabih
    Search(SearchArgs),
    /// Hash files
    Hash(HashArgs),
    /// Add a member to a dataset
    AddMember(AddMemberArgs),
    /// Generate shell completions
    Completion(CompletionArgs),
    #[cfg(feature = "sftp")]
    /// Use SFTP to scan for files to upload.
    Sftp(SftpArgs),
}

#[derive(Args)]
struct InitArgs {
    /// The dabih private key to use for decryption
    #[arg(value_name = "privateKeyFile")]
    key_file: Option<String>,
}

#[derive(Args)]
struct KeygenArgs {
    /// The path where to new key should be stored
    #[arg(value_name = "rootKeyFile")]
    key_file: Option<String>,
}

#[derive(Args)]
struct RecoverArgs {
    /// The path where to new key should be stored
    #[arg(short, long, value_name = "rootKeyFile")]
    key_file: String,
    #[arg(short, long)]
    output: Option<String>,

    path: String,
}

#[derive(Args)]
struct CompletionArgs {
    /// One of [Bash, Elvish, Fish, PowerShell, Zsh]
    shell: Shell,
}

#[derive(Args)]
struct SearchArgs {
    query: Option<String>,
    #[arg(short, long, default_value_t = false)]
    uploader: bool,
    #[arg(short, long, default_value_t = false)]
    id: bool,
}
#[derive(Args)]
struct AddMemberArgs {
    /// the mnemonic of the dataset you want to edit
    mnemonic: String,
    /// the userid of the new member
    sub: String,
    /// give the new member write permission
    #[arg(short, long, default_value_t = false)]
    write: bool,
}

#[derive(Args)]
struct UploadArgs {
    /// The files that should be uploaded to dabih, this can also be a glob pattern
    paths: Vec<String>,
    /// If set, all files in a folder will be uploaded seperately
    #[arg(short, long)]
    recursive: bool,

    /// Set the name for the dataset
    #[arg(short, long)]
    name: Option<String>,

    /// If set, folders will be gziped and then uploaded as single file.
    #[arg(short, long)]
    zip: bool,
    /// Max number of files that should be uploaded, set to -1 for unlimited.
    #[arg(short, long, default_value_t = 10)]
    limit: i64,
}

#[derive(Args)]
struct HashArgs {
    /// The files that should be hashed , this can also be a glob pattern
    paths: Vec<String>,
}

#[derive(Args)]
struct DownloadArgs {
    /// The files that should be uploaded to dabih, this can also be a glob pattern
    mnemonics: Vec<String>,
    /// If set, all files in a folder will be uploaded seperately
    #[arg(short, long)]
    output: Option<String>,
    #[arg(short, long)]
    force: bool,
}

#[derive(Args)]
struct SftpArgs {
    /// The files that should be uploaded to dabih, this can also be a glob pattern
    mnemonics: Vec<String>,
    /// If set, all files in a folder will be uploaded seperately
    #[arg(short, long)]
    output: Option<String>,
    #[arg(short, long)]
    force: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    // You can check for the existence of subcommands, and if found use their
    // matches just as you would the top level cmd
    match &cli.command {
        Commands::Init(args) => {
            let InitArgs { key_file } = args;
            init::init(key_file).await?;
        }
        Commands::Config => {
            let ctx = Context::read()?;
            api::check_key(&ctx).await?;
        }
        Commands::Upload(args) => {
            let UploadArgs {
                paths,
                recursive,
                name,
                zip,
                limit,
            } = args;
            let files = upload::resolve(paths.clone(), *recursive, *zip, *limit)?;
            if files.is_empty() {
                bail!("Did not find any files to upload.");
            }
            let ctx = Context::read_without_key()?;
            for file in files {
                upload::upload(&ctx, file, name.clone()).await?;
            }
        }
        Commands::Download(args) => {
            let DownloadArgs {
                mnemonics,
                output,
                force,
            } = args;
            let ctx = Context::read()?;
            download::download_all(&ctx, mnemonics, output, *force).await?;
        }
        Commands::Keygen(args) => {
            let KeygenArgs { key_file } = args;
            crypto::generate_keypair(key_file)?;
        }
        Commands::Recover(args) => {
            let RecoverArgs {
                key_file,
                path,
                output,
            } = args;
            recovery::recover(key_file, path, output)?;
        }
        Commands::Search(args) => {
            let SearchArgs {
                query,
                uploader,
                id,
            } = args;

            let q = match query {
                Some(q) => q.clone(),
                None => "".to_owned(),
            };
            let ctx = Context::read()?;
            let datasets = api::search_datasets(&ctx, q, *uploader).await?;
            if *id {
                for dataset in datasets {
                    println!("{}", dataset.mnemonic);
                }
            } else {
                let json = serde_json::to_string_pretty(&datasets)?;
                println!("{}", json);
            }
        }
        Commands::Hash(args) => {
            let HashArgs { paths } = args;
            let files = upload::resolve(paths.clone(), true, false, -1)?;
            hash::hash_files(&files)?;
        }
        Commands::AddMember(args) => {
            let AddMemberArgs {
                mnemonic,
                sub,
                write,
            } = args;
            let ctx = Context::read()?;
            member::add_member(&ctx, mnemonic, sub, *write).await?;
        }
        Commands::Completion(args) => {
            let CompletionArgs { shell } = args;
            generate(
                shell.clone(),
                &mut Cli::command(),
                "dabih",
                &mut io::stdout(),
            );
        }
        #[cfg(feature = "sftp")]
        Commands::Sftp(args) => {
            let ctx = config::read_context()?;
            sftp::scan(&ctx)?;
        }
    };
    Ok(())
}
