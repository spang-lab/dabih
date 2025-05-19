use thiserror::Error;

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

    #[error("Connection to the API server endpoint {url} failed")]
    ConnectionError { url: String },

    #[error("Authentication error")]
    AuthenticationError,

    #[error("Api error")]
    ApiError,

    #[error("Failed to deserialize response")]
    ResponseDeserializationError(#[from] serde_json::Error),
}
pub type Result<T> = std::result::Result<T, CliError>;
