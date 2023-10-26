use anyhow::Result;
use inquire::Text;
use inquire::{validator::Validation, Confirm};
use url::Url;

use crate::config::Context;

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

fn get_token(url: String) -> Result<String> {
    let profile = Url::parse(&url)?.join("profile")?;
    let help_message = format!(
        "You can generaten an Api Token on the dabih web interface.\n Go to {} ",
        profile
    );
    let text = Text::new("Api Token: ")
        .with_help_message(&help_message)
        .prompt()?;
    Ok(text)
}

pub async fn init(key_file: &Option<String>) -> Result<()> {
    let path = Context::default_path()?;
    let existing = match Context::read(path.clone()) {
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

    let url = get_url()?;
    let token = get_token(url.clone())?;
    let ctx = Context::build(path, url, token, key_file.clone())?;
    ctx.write()?;
    Ok(())
}
