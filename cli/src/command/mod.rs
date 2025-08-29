pub mod status;

use clap::Subcommand;

#[derive(Subcommand, Debug)]
pub enum Commands {
    Status(status::Status),
}
