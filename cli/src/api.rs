use std::sync::Arc;

use crate::chunked_reader;
use openapi::{
    apis::{configuration::Configuration, filesystem_api, upload_api, user_api, util_api},
    models::{
        AddDirectoryBody, Chunk, Directory, File, FileDownload, Healthy200Response, Inode,
        ListResponse, UploadStartBody, UserResponse,
    },
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InodeType {
    File = 0,
    Directory = 1,
    Upload = 2,
    Trash = 10,
    Root = 11,
    Home = 12,
}
impl InodeType {
    pub fn from_u32(value: u32) -> Result<Self> {
        match value {
            x if x == InodeType::File as u32 => Ok(InodeType::File),
            x if x == InodeType::Directory as u32 => Ok(InodeType::Directory),
            x if x == InodeType::Upload as u32 => Ok(InodeType::Upload),
            x if x == InodeType::Trash as u32 => Ok(InodeType::Trash),
            x if x == InodeType::Root as u32 => Ok(InodeType::Root),
            x if x == InodeType::Home as u32 => Ok(InodeType::Home),
            _ => Err(CliError::UnexpectedError(format!(
                "Unknown inode type: {}",
                value
            ))),
        }
    }
    pub fn as_char(&self) -> char {
        match self {
            InodeType::File => 'f',
            InodeType::Directory => 'd',
            InodeType::Upload => 'u',
            InodeType::Trash => 't',
            InodeType::Root => 'r',
            InodeType::Home => 'h',
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            InodeType::File => "File",
            InodeType::Directory => "Directory",
            InodeType::Upload => "Upload",
            InodeType::Trash => "Trash",
            InodeType::Root => "Root",
            InodeType::Home => "Home",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Permission {
    None = 0,
    Read = 1,
    Write = 2,
}

use crate::error::{CliError, Result};

#[derive(Debug, Clone)]
pub struct Api {
    config: Arc<Configuration>,
    fs: FileSystemApi,
    upload: UploadApi,
    user: UserApi,
    util: UtilApi,
}

impl Api {
    pub fn new(config: Configuration) -> Self {
        let config = Arc::new(config);

        Self {
            fs: FileSystemApi {
                config: config.clone(),
            },
            upload: UploadApi {
                config: config.clone(),
            },
            user: UserApi {
                config: config.clone(),
            },
            util: UtilApi {
                config: config.clone(),
            },
            config,
        }
    }
    pub fn fs(&self) -> &FileSystemApi {
        &self.fs
    }
    pub fn upload(&self) -> &UploadApi {
        &self.upload
    }
    pub fn user(&self) -> &UserApi {
        &self.user
    }
    pub fn util(&self) -> &UtilApi {
        &self.util
    }
    pub fn config(&self) -> &Configuration {
        &self.config
    }
}

#[derive(Debug, Clone)]
pub struct FileSystemApi {
    config: Arc<Configuration>,
}
impl FileSystemApi {
    pub async fn resolve_path(&self, path: &str) -> Result<Option<Inode>> {
        match filesystem_api::resolve_path(&self.config, path).await {
            Ok(inode) => Ok(Some(inode)),
            Err(_e) => Ok(None),
        }
    }
    pub async fn add_directory(
        &self,
        name: String,
        parent: Option<String>,
        tag: Option<String>,
    ) -> Result<Directory> {
        filesystem_api::add_directory(&self.config, AddDirectoryBody { name, parent, tag })
            .await
            .map_err(|e| CliError::ApiError(format!("Failed to add directory: {}", e)))
    }
    pub async fn list_home(&self) -> Result<ListResponse> {
        filesystem_api::list_home(&self.config)
            .await
            .map_err(|e| CliError::ApiError(format!("Failed to list home: {}", e)))
    }

    pub async fn list(&self, mnemonic: &str) -> Result<ListResponse> {
        filesystem_api::list_inodes(&self.config, mnemonic)
            .await
            .map_err(|e| CliError::ApiError(format!("Failed to list inodes: {}", e)))
    }
    pub async fn file_info(&self, mnemonic: &str) -> Result<FileDownload> {
        filesystem_api::file_info(&self.config, mnemonic)
            .await
            .map_err(|e| CliError::ApiError(format!("Failed to get file: {}", e)))
    }
}

#[derive(Debug, Clone)]
pub struct UploadApi {
    config: Arc<Configuration>,
}

impl UploadApi {
    pub async fn start_upload(
        &self,
        file_name: String,
        directory: Option<String>,
        file_path: Option<String>,
        size: Option<u64>,
        tag: Option<String>,
    ) -> Result<File> {
        upload_api::start_upload(
            &self.config,
            UploadStartBody {
                file_name,
                directory,
                file_path,
                size,
                tag,
            },
        )
        .await
        .map_err(|e| CliError::ApiError(format!("Failed to start upload: {}", e)))
    }

    pub async fn chunk_upload(
        &self,
        mnemonic: &str,
        chunk: &chunked_reader::Chunk,
    ) -> Result<Chunk> {
        let digest_header = format!("sha-256={}", chunk.digest());
        upload_api::chunk_upload(
            &self.config,
            mnemonic,
            &chunk.content_range(),
            &digest_header,
            chunk.data().to_vec(),
        )
        .await
        .map_err(|e| CliError::ApiError(format!("Failed to upload chunk: {}", e)))
    }

    pub async fn finish_upload(&self, mnemonic: &str) -> Result<File> {
        upload_api::finish_upload(&self.config, mnemonic)
            .await
            .map_err(|e| CliError::ApiError(format!("Failed to finish upload: {}", e)))
    }
}

#[derive(Debug, Clone)]
pub struct UserApi {
    config: Arc<Configuration>,
}

impl UserApi {
    pub async fn me(&self) -> Result<UserResponse> {
        user_api::me(&self.config)
            .await
            .map_err(|_e| CliError::AuthenticationError)
    }
}

#[derive(Debug, Clone)]
pub struct UtilApi {
    config: Arc<Configuration>,
}

impl UtilApi {
    pub async fn healthy(&self) -> Result<Healthy200Response> {
        util_api::healthy(&self.config)
            .await
            .map_err(|_e| CliError::ConnectionError(self.config.base_path.clone()))
    }
}
