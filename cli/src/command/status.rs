use crate::config::Context;
use crate::error::Result;
use clap::Args;

#[derive(Args, Debug)]
pub struct Status {}

pub async fn run(ctx: Context) -> Result<()> {
    Ok(())
}
