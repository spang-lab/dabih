use reqwest::StatusCode;
use thiserror::Error;

use crate::api::types::error::ConversionError;

#[derive(Error, Debug)]
pub enum CliError {
    #[error("Failed to parse the configuration file")]
    ConfigParseError(#[from] serde_yaml::Error),

    #[error("Failed to read the private key")]
    PrivateKeyReadError(#[from] std::io::Error),

    #[error("Failed to parse the private key")]
    PrivateKeyParseError(#[from] rsa::errors::Error),

    #[error("Failed to parse pkcs8 private key")]
    PrivateKeyPkcs8ParseError(#[from] rsa::pkcs8::Error),

    #[error("Failed to send request")]
    RequestError(#[from] reqwest::Error),

    #[error("Config directory does not exist")]
    ConfigDirNotFound,

    #[error("Connection to the API server endpoint {0} failed")]
    ConnectionError(String),

    #[error("Authentication error")]
    AuthenticationError,

    #[error("Failed to convert: {0}")]
    ConversionError(#[from] ConversionError),

    #[error("Authorization error")]
    AuthorizationError,

    #[error("API Error: {0}")]
    ApiError(String),

    #[error("Failed to convert key to spki")]
    KeyToPkcs1Error(#[from] rsa::pkcs8::spki::Error),

    #[error("Failed to deserialize response")]
    ResponseDeserializationError(#[from] serde_json::Error),

    #[error("Invalid glob pattern: {0}")]
    GlobPatternError(#[from] glob::PatternError),

    #[error("Glob matching error: {0}")]
    GlobMatchError(#[from] glob::GlobError),

    #[error("Unexpected error: {0}")]
    UnexpectedError(String),

    #[error("API returned error response: status {0}")]
    ErrorResponse(String),

    #[error("Failed to read response body: {0}")]
    ResponseBodyError(reqwest::Error),

    #[error("Invalid response payload {0}")]
    InvalidResponsePayload(String),

    #[error("Unexpected response: status {}", .0.status())]
    UnexpectedResponse(reqwest::Response),

    #[error("Custom error: {0}")]
    Custom(String),

    #[error("Invalid request: {0}")]
    InvalidRequest(String),

    #[error("Invalid upgrade: {0}")]
    InvalidUpgrade(reqwest::Error),
}

impl<E> From<progenitor_client::Error<E>> for CliError {
    fn from(err: progenitor_client::Error<E>) -> Self {
        match err {
            progenitor_client::Error::CommunicationError(e) => match e.status() {
                Some(StatusCode::UNAUTHORIZED) => CliError::AuthenticationError,
                Some(StatusCode::FORBIDDEN) => CliError::AuthorizationError,
                Some(StatusCode::BAD_REQUEST) => CliError::ApiError(e.to_string()),
                Some(_) => CliError::ApiError(e.to_string()),
                None => CliError::ConnectionError(e.to_string()),
            },
            progenitor_client::Error::InvalidRequest(s) => CliError::InvalidRequest(s),
            progenitor_client::Error::InvalidUpgrade(e) => CliError::InvalidUpgrade(e),
            progenitor_client::Error::ErrorResponse(rv) => {
                CliError::ErrorResponse(rv.status().to_string())
            }
            progenitor_client::Error::ResponseBodyError(e) => CliError::ResponseBodyError(e),
            progenitor_client::Error::InvalidResponsePayload(b, e) => {
                dbg!(&b);
                CliError::InvalidResponsePayload(e.to_string())
            }
            progenitor_client::Error::UnexpectedResponse(r) => CliError::UnexpectedResponse(r),
            progenitor_client::Error::Custom(s) => CliError::Custom(s),
        }
    }
}

pub type Result<T> = std::result::Result<T, CliError>;
