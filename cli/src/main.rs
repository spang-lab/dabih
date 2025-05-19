use std::{env, path::PathBuf};

use config::Context;
use openapi::apis::{configuration::Configuration, user_api::me};

mod config;
mod error;
use error::Result;
mod private_key;

#[tokio::main]
async fn main() -> Result<()> {
    let ctx_path = match env::var("XDG_CONFIG_HOME") {
        Ok(v) => PathBuf::from(v).join("dabih"),
        Err(_) => PathBuf::from(env::var("HOME").unwrap())
            .join(".config")
            .join("dabih"),
    };
    let ctx = Context::from(ctx_path)?;
    dbg!(&ctx);

    let token = "dabih_at_CgI-W7i2CL7rGWmF_tW7MJgjsaBx5x_U";

    let config = Configuration {
        base_path: "http://localhost:3001/api/v1".to_string(),
        user_agent: Some("rust-client".to_string()),
        bearer_access_token: Some(token.to_string()),
        ..Default::default()
    };
    let user = me(&config).await.unwrap();

    dbg!(user);

    println!("Hello, world!");
    Ok(())
}
