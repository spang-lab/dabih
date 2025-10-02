use std::{env, path::PathBuf};

use clap::Parser;
use dabih::command::{self, Commands};
use dabih::config::Context;
use dabih::error::Result;
use dabih::log;

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

    if let Commands::Hash(args) = cli.command {
        command::hash::run(args).await?;
        return Ok(());
    }

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
        Commands::Status(_) => command::status::run(ctx).await?,
        Commands::Upload(args) => command::upload::run(ctx, args).await?,
        Commands::List(args) => command::list::run(ctx, args).await?,
        Commands::Download(args) => command::download::run(ctx, args).await?,
        Commands::Member(args) => command::member::run(ctx, args).await?,
        Commands::Cat(args) => command::cat::run(ctx, args).await?,
        _ => { /* already handled above */ }
    }
    Ok(())
}
