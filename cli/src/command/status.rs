use crate::config::Context;
use crate::error::Result;
use clap::Args;
use progenitor_client::ClientInfo;

#[derive(Args, Debug)]
pub struct Status {}

pub async fn run(ctx: Context) -> Result<()> {
    let user = match ctx.user() {
        Some(u) => u,
        None => {
            println!("Not logged in. Please run 'dabih login' first.");
            return Ok(());
        }
    };
    let base_url = ctx.api().baseurl();
    let key = ctx.private_key();

    // print green connected message
    println!("\x1b[32mConnected\x1b[0m");
    println!("  Server URL: {}", base_url);

    println!("\x1b[32mUser:\x1b[0m");
    println!("  ID: {}", user.sub);
    println!("  Email: {}", user.email);
    println!("\x1b[32mKey:\x1b[0m");

    match key {
        Some(k) => {
            let fingerprint = k.hash()?;
            println!(" Fingerprint: {}", fingerprint);
        }
        None => {
            println!("Not found");
        }
    }

    Ok(())
}
