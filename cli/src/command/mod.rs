pub mod status;
pub mod upload;

use clap::Subcommand;

#[derive(Subcommand, Debug)]
pub enum Commands {
    Status(status::Status),
    Upload(upload::Upload),
}
