use serde::{ser::Serializer, Serialize};

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Request(#[from] reqwest::Error),
    #[error("Invalid url")]
    UrlParse(#[from] url::ParseError),
    #[error(transparent)]
    InvalidHeader(#[from] reqwest::header::InvalidHeaderValue),
    #[error(transparent)]
    GlobError(#[from] glob::GlobError),
    #[error(transparent)]
    PatternError(#[from] glob::PatternError),
    #[error(transparent)]
    JsonError(#[from] serde_json::Error),
    #[error("No config dir")]
    ConfigDirError(),
    #[error(transparent)]
    Decode(#[from] base64::DecodeError),
    #[error(transparent)]
    TauriError(#[from] tauri::Error),
    #[error("{0}")]
    ResponseError(String),
    #[error("{0}")]
    Error(String),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
