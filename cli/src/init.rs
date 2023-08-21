use anyhow::Result;
use inquire::Text;
use inquire::{validator::Validation, Confirm};
use url::Url;

use crate::config::{read_config, read_private_key, write_config, Config};

fn get_url() -> Result<String> {
    let validator = |input: &str| match Url::parse(input) {
        Ok(url) => {
            if url.scheme() == "https" || url.scheme() == "http" {
                return Ok(Validation::Valid);
            }
            return Ok(Validation::Invalid("Not a valid url scheme".into()));
        }
        Err(_) => Ok(Validation::Invalid("Not a valid url".into())),
    };

    let text = Text::new("Dabih Url: ")
        .with_default("https://dabih.spang-lab.de")
        .with_validator(validator)
        .prompt()?;
    Ok(text)
}

fn get_token() -> Result<String> {
    let text = Text::new("Api Token: ")
        .with_help_message("You can generaten an Api Token on the dabih web interface")
        .prompt()?;
    Ok(text)
}

pub async fn init(key_file: String) -> Result<()> {
    let existing = match read_config() {
        Ok(_) => true,
        Err(_) => false,
    };
    if existing {
        let ans = Confirm::new("There already is a config file for dabih. Overwrite?")
            .with_default(false)
            .prompt()?;
        if !ans {
            println!("Init cancelled");
            return Ok(());
        }
    }
    let key = read_private_key(key_file)?;
    let pem_data = key.private_key_to_pem()?;
    let private_key = String::from_utf8(pem_data)?;
    let config = Config {
        url: get_url()?,
        token: get_token()?,
        private_key,
    };
    write_config(&config)?;
    Ok(())
}
