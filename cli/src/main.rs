use std::{env, path::PathBuf};

mod command;
mod config;
mod error;
mod log;
mod private_key;

use clap::Parser;
use config::Context;
use error::Result;

use command::{Commands, status};

use tracing::{debug, trace};

#[derive(Parser, Debug)]
#[command(name = "myapp")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
    #[arg(short, long, action = clap::ArgAction::Count)]
    verbose: u8,
    #[arg(short, long)]
    quiet: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    log::init(cli.verbose, cli.quiet);
    debug!("Verbose logging enabled");
    trace!("Debug trace enabled");

    let ctx_path = match env::var("XDG_CONFIG_HOME") {
        Ok(v) => PathBuf::from(v).join("dabih"),
        Err(_) => PathBuf::from(env::var("HOME").unwrap())
            .join(".config")
            .join("dabih"),
    };
    let mut ctx = Context::from(ctx_path)?;
    ctx.set_verbose(cli.verbose, cli.quiet);
    ctx.init().await?;

    match cli.command {
        Commands::Status(_) => status::run(ctx).await?,
    }
    Ok(())
}
