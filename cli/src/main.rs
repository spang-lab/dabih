use clap::{Args, Parser, Subcommand};

use anyhow::{Ok, Result};
mod api;
mod config;
mod crypto;
mod init;

use crate::crypto::CryptoKey;

/// Simple program to greet a person
#[derive(Parser)]
#[command(author, version, about, long_about = None)]
#[command(propagate_version = true)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Adds files to myapp
    Add(AddArgs),
    Init(InitArgs),
    Config,
}

#[derive(Args)]
struct AddArgs {
    name: Option<String>,
}

#[derive(Args)]
struct InitArgs {
    #[arg(value_name = "privateKeyFile")]
    key_file: String,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    // You can check for the existence of subcommands, and if found use their
    // matches just as you would the top level cmd
    match &cli.command {
        Commands::Add(args) => {
            let name = &args.name;
            println!("'myapp add' was used, name is: {name:?}")
        }
        Commands::Init(args) => {
            init::init(args.key_file.clone()).await?;
        }
        Commands::Config => {
            let config = config::read_config()?;
            let key = CryptoKey::from(config.private_key.clone())?;
            println!("Dabih Config: \n {}", config);
            api::check_key(&config, &key).await?;
        }
    };
    Ok(())
}
