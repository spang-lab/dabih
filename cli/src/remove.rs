use anyhow::Result;
use inquire::Confirm;

use crate::api;
use crate::config::Context;

pub async fn remove(ctx: &Context, mnemonic: &String, yes: bool, destroy: bool) -> Result<()> {
    if !yes {
        let prompt = format!("Remove {}?", mnemonic);
        let ans = Confirm::new(&prompt).with_default(false).prompt()?;
        if !ans {
            println!("Cancelled.");
            return Ok(());
        }
    }
    if destroy {
        println!("Destroying {}", mnemonic);
        api::destroy_dataset(ctx, mnemonic).await?;
    } else {
        println!("Removing {}", mnemonic);
        api::remove_dataset(ctx, mnemonic).await?;
    }

    Ok(())
}
