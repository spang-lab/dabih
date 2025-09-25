#[allow(unused_imports)]
pub use progenitor_client::{ByteStream, ClientInfo, Error, ResponseValue};
#[allow(unused_imports)]
use progenitor_client::{encode_path, ClientHooks, OperationInfo, RequestBuilderExt};
/// Types used as operation parameters and responses.
#[allow(clippy::all)]
pub mod types {
    /// Error types.
    pub mod error {
        /// Error from a `TryFrom` or `FromStr` implementation.
        pub struct ConversionError(::std::borrow::Cow<'static, str>);
        impl ::std::error::Error for ConversionError {}
        impl ::std::fmt::Display for ConversionError {
            fn fmt(
                &self,
                f: &mut ::std::fmt::Formatter<'_>,
            ) -> Result<(), ::std::fmt::Error> {
                ::std::fmt::Display::fmt(&self.0, f)
            }
        }
        impl ::std::fmt::Debug for ConversionError {
            fn fmt(
                &self,
                f: &mut ::std::fmt::Formatter<'_>,
            ) -> Result<(), ::std::fmt::Error> {
                ::std::fmt::Debug::fmt(&self.0, f)
            }
        }
        impl From<&'static str> for ConversionError {
            fn from(value: &'static str) -> Self {
                Self(value.into())
            }
        }
        impl From<String> for ConversionError {
            fn from(value: String) -> Self {
                Self(value.into())
            }
        }
    }
    ///`AddDirectoryBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "name"
    ///  ],
    ///  "properties": {
    ///    "name": {
    ///      "description": "The name of the directory",
    ///      "type": "string"
    ///    },
    ///    "parent": {
    ///      "description": "The mnemonic of the parent directory",
    ///      "type": "string"
    ///    },
    ///    "tag": {
    ///      "description": "A custom searchable tag for the directory",
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct AddDirectoryBody {
        ///The name of the directory
        pub name: ::std::string::String,
        ///The mnemonic of the parent directory
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub parent: ::std::option::Option<::std::string::String>,
        ///A custom searchable tag for the directory
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub tag: ::std::option::Option<::std::string::String>,
    }
    impl ::std::convert::From<&AddDirectoryBody> for AddDirectoryBody {
        fn from(value: &AddDirectoryBody) -> Self {
            value.clone()
        }
    }
    /**The AES-256 encryption key used to encrypt and decrypt datasets.
base64url encoded*/
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "description": "The AES-256 encryption key used to encrypt and decrypt datasets.\nbase64url encoded",
    ///  "type": "string"
    ///}
    /// ```
    /// </details>
    #[derive(
        ::serde::Deserialize,
        ::serde::Serialize,
        Clone,
        Debug,
        Eq,
        Hash,
        Ord,
        PartialEq,
        PartialOrd
    )]
    #[serde(transparent)]
    pub struct AesKey(pub ::std::string::String);
    impl ::std::ops::Deref for AesKey {
        type Target = ::std::string::String;
        fn deref(&self) -> &::std::string::String {
            &self.0
        }
    }
    impl ::std::convert::From<AesKey> for ::std::string::String {
        fn from(value: AesKey) -> Self {
            value.0
        }
    }
    impl ::std::convert::From<&AesKey> for AesKey {
        fn from(value: &AesKey) -> Self {
            value.clone()
        }
    }
    impl ::std::convert::From<::std::string::String> for AesKey {
        fn from(value: ::std::string::String) -> Self {
            Self(value)
        }
    }
    impl ::std::str::FromStr for AesKey {
        type Err = ::std::convert::Infallible;
        fn from_str(value: &str) -> ::std::result::Result<Self, Self::Err> {
            Ok(Self(value.to_string()))
        }
    }
    impl ::std::fmt::Display for AesKey {
        fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
            self.0.fmt(f)
        }
    }
    ///`Chunk`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "crc",
    ///    "createdAt",
    ///    "dataId",
    ///    "end",
    ///    "hash",
    ///    "id",
    ///    "iv",
    ///    "start",
    ///    "updatedAt"
    ///  ],
    ///  "properties": {
    ///    "crc": {
    ///      "description": "The CRC32 checksum of the encrypted chunk data base64url encoded",
    ///      "type": [
    ///        "string",
    ///        "null"
    ///      ]
    ///    },
    ///    "createdAt": {
    ///      "description": "chunk creation timestamp",
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "dataId": {
    ///      "description": "The id of the data the chunk belongs to",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "end": {
    ///      "description": "The end of the chunk as a byte position in the file",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "hash": {
    ///      "description": "The SHA-256 hash of the unencrypted chunk data base64url encoded",
    ///      "type": "string"
    ///    },
    ///    "id": {
    ///      "description": "The database id of the chunk",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "iv": {
    ///      "description": "The AES-256 initialization vector base64url encoded",
    ///      "type": "string"
    ///    },
    ///    "start": {
    ///      "description": "The start of the chunk as a byte position in the file",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "updatedAt": {
    ///      "description": "chunk last update timestamp",
    ///      "type": "string",
    ///      "format": "date-time"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct Chunk {
        ///The CRC32 checksum of the encrypted chunk data base64url encoded
        pub crc: ::std::option::Option<::std::string::String>,
        ///chunk creation timestamp
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        ///The id of the data the chunk belongs to
        #[serde(rename = "dataId")]
        pub data_id: ::std::string::String,
        ///The end of the chunk as a byte position in the file
        pub end: ::std::string::String,
        ///The SHA-256 hash of the unencrypted chunk data base64url encoded
        pub hash: ::std::string::String,
        ///The database id of the chunk
        pub id: ::std::string::String,
        ///The AES-256 initialization vector base64url encoded
        pub iv: ::std::string::String,
        ///The start of the chunk as a byte position in the file
        pub start: ::std::string::String,
        ///chunk last update timestamp
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&Chunk> for Chunk {
        fn from(value: &Chunk) -> Self {
            value.clone()
        }
    }
    ///`ChunkData`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "allOf": [
    ///    {
    ///      "$ref": "#/components/schemas/FileData"
    ///    },
    ///    {
    ///      "type": "object",
    ///      "required": [
    ///        "chunks"
    ///      ],
    ///      "properties": {
    ///        "chunks": {
    ///          "type": "array",
    ///          "items": {
    ///            "$ref": "#/components/schemas/Chunk"
    ///          }
    ///        }
    ///      }
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct ChunkData {
        pub chunks: ::std::vec::Vec<Chunk>,
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        #[serde(rename = "createdBy")]
        pub created_by: ::std::string::String,
        #[serde(rename = "fileName")]
        pub file_name: ::std::string::String,
        #[serde(rename = "filePath")]
        pub file_path: ::std::option::Option<::std::string::String>,
        pub hash: ::std::option::Option<::std::string::String>,
        ///The database id of the file data
        pub id: ::std::string::String,
        #[serde(rename = "keyHash")]
        pub key_hash: ::std::string::String,
        ///The size of the file in bytes
        pub size: ::std::string::String,
        pub uid: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&ChunkData> for ChunkData {
        fn from(value: &ChunkData) -> Self {
            value.clone()
        }
    }
    ///`CryptoJsonWebKey`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "properties": {
    ///    "crv": {
    ///      "type": "string"
    ///    },
    ///    "d": {
    ///      "type": "string"
    ///    },
    ///    "dp": {
    ///      "type": "string"
    ///    },
    ///    "dq": {
    ///      "type": "string"
    ///    },
    ///    "e": {
    ///      "type": "string"
    ///    },
    ///    "k": {
    ///      "type": "string"
    ///    },
    ///    "kty": {
    ///      "type": "string"
    ///    },
    ///    "n": {
    ///      "type": "string"
    ///    },
    ///    "p": {
    ///      "type": "string"
    ///    },
    ///    "q": {
    ///      "type": "string"
    ///    },
    ///    "qi": {
    ///      "type": "string"
    ///    },
    ///    "x": {
    ///      "type": "string"
    ///    },
    ///    "y": {
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct CryptoJsonWebKey {
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub crv: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub d: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub dp: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub dq: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub e: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub k: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub kty: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub n: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub p: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub q: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub qi: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub x: ::std::option::Option<::std::string::String>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub y: ::std::option::Option<::std::string::String>,
    }
    impl ::std::convert::From<&CryptoJsonWebKey> for CryptoJsonWebKey {
        fn from(value: &CryptoJsonWebKey) -> Self {
            value.clone()
        }
    }
    impl ::std::default::Default for CryptoJsonWebKey {
        fn default() -> Self {
            Self {
                crv: Default::default(),
                d: Default::default(),
                dp: Default::default(),
                dq: Default::default(),
                e: Default::default(),
                k: Default::default(),
                kty: Default::default(),
                n: Default::default(),
                p: Default::default(),
                q: Default::default(),
                qi: Default::default(),
                x: Default::default(),
                y: Default::default(),
            }
        }
    }
    ///`DabihInfo`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "branding",
    ///    "version"
    ///  ],
    ///  "properties": {
    ///    "branding": {
    ///      "type": "object",
    ///      "required": [
    ///        "admin",
    ///        "contact",
    ///        "department",
    ///        "organization"
    ///      ],
    ///      "properties": {
    ///        "admin": {
    ///          "type": "object",
    ///          "required": [
    ///            "email",
    ///            "name"
    ///          ],
    ///          "properties": {
    ///            "email": {
    ///              "type": "string"
    ///            },
    ///            "name": {
    ///              "type": "string"
    ///            }
    ///          }
    ///        },
    ///        "contact": {
    ///          "type": "object",
    ///          "required": [
    ///            "city",
    ///            "country",
    ///            "email",
    ///            "name",
    ///            "phone",
    ///            "state",
    ///            "street",
    ///            "zip"
    ///          ],
    ///          "properties": {
    ///            "city": {
    ///              "type": "string"
    ///            },
    ///            "country": {
    ///              "type": "string"
    ///            },
    ///            "email": {
    ///              "type": "string"
    ///            },
    ///            "name": {
    ///              "type": "string"
    ///            },
    ///            "phone": {
    ///              "type": "string"
    ///            },
    ///            "state": {
    ///              "type": "string"
    ///            },
    ///            "street": {
    ///              "type": "string"
    ///            },
    ///            "zip": {
    ///              "type": "string"
    ///            }
    ///          }
    ///        },
    ///        "department": {
    ///          "type": "object",
    ///          "required": [
    ///            "logo",
    ///            "name",
    ///            "url"
    ///          ],
    ///          "properties": {
    ///            "logo": {
    ///              "type": "string"
    ///            },
    ///            "name": {
    ///              "type": "string"
    ///            },
    ///            "url": {
    ///              "type": "string"
    ///            }
    ///          }
    ///        },
    ///        "organization": {
    ///          "type": "object",
    ///          "required": [
    ///            "logo",
    ///            "name",
    ///            "url"
    ///          ],
    ///          "properties": {
    ///            "logo": {
    ///              "type": "string"
    ///            },
    ///            "name": {
    ///              "type": "string"
    ///            },
    ///            "url": {
    ///              "type": "string"
    ///            }
    ///          }
    ///        }
    ///      }
    ///    },
    ///    "version": {
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct DabihInfo {
        pub branding: DabihInfoBranding,
        pub version: ::std::string::String,
    }
    impl ::std::convert::From<&DabihInfo> for DabihInfo {
        fn from(value: &DabihInfo) -> Self {
            value.clone()
        }
    }
    ///`DabihInfoBranding`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "admin",
    ///    "contact",
    ///    "department",
    ///    "organization"
    ///  ],
    ///  "properties": {
    ///    "admin": {
    ///      "type": "object",
    ///      "required": [
    ///        "email",
    ///        "name"
    ///      ],
    ///      "properties": {
    ///        "email": {
    ///          "type": "string"
    ///        },
    ///        "name": {
    ///          "type": "string"
    ///        }
    ///      }
    ///    },
    ///    "contact": {
    ///      "type": "object",
    ///      "required": [
    ///        "city",
    ///        "country",
    ///        "email",
    ///        "name",
    ///        "phone",
    ///        "state",
    ///        "street",
    ///        "zip"
    ///      ],
    ///      "properties": {
    ///        "city": {
    ///          "type": "string"
    ///        },
    ///        "country": {
    ///          "type": "string"
    ///        },
    ///        "email": {
    ///          "type": "string"
    ///        },
    ///        "name": {
    ///          "type": "string"
    ///        },
    ///        "phone": {
    ///          "type": "string"
    ///        },
    ///        "state": {
    ///          "type": "string"
    ///        },
    ///        "street": {
    ///          "type": "string"
    ///        },
    ///        "zip": {
    ///          "type": "string"
    ///        }
    ///      }
    ///    },
    ///    "department": {
    ///      "type": "object",
    ///      "required": [
    ///        "logo",
    ///        "name",
    ///        "url"
    ///      ],
    ///      "properties": {
    ///        "logo": {
    ///          "type": "string"
    ///        },
    ///        "name": {
    ///          "type": "string"
    ///        },
    ///        "url": {
    ///          "type": "string"
    ///        }
    ///      }
    ///    },
    ///    "organization": {
    ///      "type": "object",
    ///      "required": [
    ///        "logo",
    ///        "name",
    ///        "url"
    ///      ],
    ///      "properties": {
    ///        "logo": {
    ///          "type": "string"
    ///        },
    ///        "name": {
    ///          "type": "string"
    ///        },
    ///        "url": {
    ///          "type": "string"
    ///        }
    ///      }
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct DabihInfoBranding {
        pub admin: DabihInfoBrandingAdmin,
        pub contact: DabihInfoBrandingContact,
        pub department: DabihInfoBrandingDepartment,
        pub organization: DabihInfoBrandingOrganization,
    }
    impl ::std::convert::From<&DabihInfoBranding> for DabihInfoBranding {
        fn from(value: &DabihInfoBranding) -> Self {
            value.clone()
        }
    }
    ///`DabihInfoBrandingAdmin`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "email",
    ///    "name"
    ///  ],
    ///  "properties": {
    ///    "email": {
    ///      "type": "string"
    ///    },
    ///    "name": {
    ///      "type": "string"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct DabihInfoBrandingAdmin {
        pub email: ::std::string::String,
        pub name: ::std::string::String,
    }
    impl ::std::convert::From<&DabihInfoBrandingAdmin> for DabihInfoBrandingAdmin {
        fn from(value: &DabihInfoBrandingAdmin) -> Self {
            value.clone()
        }
    }
    ///`DabihInfoBrandingContact`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "city",
    ///    "country",
    ///    "email",
    ///    "name",
    ///    "phone",
    ///    "state",
    ///    "street",
    ///    "zip"
    ///  ],
    ///  "properties": {
    ///    "city": {
    ///      "type": "string"
    ///    },
    ///    "country": {
    ///      "type": "string"
    ///    },
    ///    "email": {
    ///      "type": "string"
    ///    },
    ///    "name": {
    ///      "type": "string"
    ///    },
    ///    "phone": {
    ///      "type": "string"
    ///    },
    ///    "state": {
    ///      "type": "string"
    ///    },
    ///    "street": {
    ///      "type": "string"
    ///    },
    ///    "zip": {
    ///      "type": "string"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct DabihInfoBrandingContact {
        pub city: ::std::string::String,
        pub country: ::std::string::String,
        pub email: ::std::string::String,
        pub name: ::std::string::String,
        pub phone: ::std::string::String,
        pub state: ::std::string::String,
        pub street: ::std::string::String,
        pub zip: ::std::string::String,
    }
    impl ::std::convert::From<&DabihInfoBrandingContact> for DabihInfoBrandingContact {
        fn from(value: &DabihInfoBrandingContact) -> Self {
            value.clone()
        }
    }
    ///`DabihInfoBrandingDepartment`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "logo",
    ///    "name",
    ///    "url"
    ///  ],
    ///  "properties": {
    ///    "logo": {
    ///      "type": "string"
    ///    },
    ///    "name": {
    ///      "type": "string"
    ///    },
    ///    "url": {
    ///      "type": "string"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct DabihInfoBrandingDepartment {
        pub logo: ::std::string::String,
        pub name: ::std::string::String,
        pub url: ::std::string::String,
    }
    impl ::std::convert::From<&DabihInfoBrandingDepartment>
    for DabihInfoBrandingDepartment {
        fn from(value: &DabihInfoBrandingDepartment) -> Self {
            value.clone()
        }
    }
    ///`DabihInfoBrandingOrganization`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "logo",
    ///    "name",
    ///    "url"
    ///  ],
    ///  "properties": {
    ///    "logo": {
    ///      "type": "string"
    ///    },
    ///    "name": {
    ///      "type": "string"
    ///    },
    ///    "url": {
    ///      "type": "string"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct DabihInfoBrandingOrganization {
        pub logo: ::std::string::String,
        pub name: ::std::string::String,
        pub url: ::std::string::String,
    }
    impl ::std::convert::From<&DabihInfoBrandingOrganization>
    for DabihInfoBrandingOrganization {
        fn from(value: &DabihInfoBrandingOrganization) -> Self {
            value.clone()
        }
    }
    ///`DecryptDatasetBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "key"
    ///  ],
    ///  "properties": {
    ///    "key": {
    ///      "$ref": "#/components/schemas/AESKey"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct DecryptDatasetBody {
        pub key: AesKey,
    }
    impl ::std::convert::From<&DecryptDatasetBody> for DecryptDatasetBody {
        fn from(value: &DecryptDatasetBody) -> Self {
            value.clone()
        }
    }
    ///`Directory`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "createdAt",
    ///    "mnemonic",
    ///    "name",
    ///    "updatedAt"
    ///  ],
    ///  "properties": {
    ///    "createdAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "mnemonic": {
    ///      "type": "string"
    ///    },
    ///    "name": {
    ///      "type": "string"
    ///    },
    ///    "updatedAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct Directory {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub mnemonic: ::std::string::String,
        pub name: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&Directory> for Directory {
        fn from(value: &Directory) -> Self {
            value.clone()
        }
    }
    ///`ErrorResponse`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "message"
    ///  ],
    ///  "properties": {
    ///    "message": {
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct ErrorResponse {
        pub message: ::std::string::String,
    }
    impl ::std::convert::From<&ErrorResponse> for ErrorResponse {
        fn from(value: &ErrorResponse) -> Self {
            value.clone()
        }
    }
    ///`File`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "allOf": [
    ///    {
    ///      "$ref": "#/components/schemas/Inode"
    ///    },
    ///    {
    ///      "type": "object",
    ///      "required": [
    ///        "data"
    ///      ],
    ///      "properties": {
    ///        "data": {
    ///          "$ref": "#/components/schemas/FileData"
    ///        }
    ///      }
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct File {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub data: FileData,
        ///The database id file data if the inode is a file
        #[serde(rename = "dataId")]
        pub data_id: ::std::option::Option<::std::string::String>,
        ///The database id of the inode
        pub id: ::std::string::String,
        pub mnemonic: ::std::string::String,
        pub name: ::std::string::String,
        #[serde(rename = "parentId")]
        pub parent_id: ::serde_json::Value,
        pub tag: ::std::option::Option<::std::string::String>,
        ///The type of the inode
        #[serde(rename = "type")]
        pub type_: i32,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&File> for File {
        fn from(value: &File) -> Self {
            value.clone()
        }
    }
    ///`FileData`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "createdAt",
    ///    "createdBy",
    ///    "fileName",
    ///    "filePath",
    ///    "hash",
    ///    "id",
    ///    "keyHash",
    ///    "size",
    ///    "uid",
    ///    "updatedAt"
    ///  ],
    ///  "properties": {
    ///    "createdAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "createdBy": {
    ///      "type": "string"
    ///    },
    ///    "fileName": {
    ///      "type": "string"
    ///    },
    ///    "filePath": {
    ///      "type": [
    ///        "string",
    ///        "null"
    ///      ]
    ///    },
    ///    "hash": {
    ///      "type": [
    ///        "string",
    ///        "null"
    ///      ]
    ///    },
    ///    "id": {
    ///      "description": "The database id of the file data",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "keyHash": {
    ///      "type": "string"
    ///    },
    ///    "size": {
    ///      "description": "The size of the file in bytes",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "uid": {
    ///      "type": "string"
    ///    },
    ///    "updatedAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct FileData {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        #[serde(rename = "createdBy")]
        pub created_by: ::std::string::String,
        #[serde(rename = "fileName")]
        pub file_name: ::std::string::String,
        #[serde(rename = "filePath")]
        pub file_path: ::std::option::Option<::std::string::String>,
        pub hash: ::std::option::Option<::std::string::String>,
        ///The database id of the file data
        pub id: ::std::string::String,
        #[serde(rename = "keyHash")]
        pub key_hash: ::std::string::String,
        ///The size of the file in bytes
        pub size: ::std::string::String,
        pub uid: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&FileData> for FileData {
        fn from(value: &FileData) -> Self {
            value.clone()
        }
    }
    ///`FileDecryptionKey`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "key",
    ///    "mnemonic"
    ///  ],
    ///  "properties": {
    ///    "key": {
    ///      "$ref": "#/components/schemas/AESKey"
    ///    },
    ///    "mnemonic": {
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct FileDecryptionKey {
        pub key: AesKey,
        pub mnemonic: ::std::string::String,
    }
    impl ::std::convert::From<&FileDecryptionKey> for FileDecryptionKey {
        fn from(value: &FileDecryptionKey) -> Self {
            value.clone()
        }
    }
    ///`FileDownload`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "allOf": [
    ///    {
    ///      "$ref": "#/components/schemas/File"
    ///    },
    ///    {
    ///      "type": "object",
    ///      "required": [
    ///        "data",
    ///        "keys"
    ///      ],
    ///      "properties": {
    ///        "data": {
    ///          "$ref": "#/components/schemas/ChunkData"
    ///        },
    ///        "keys": {
    ///          "type": "array",
    ///          "items": {
    ///            "$ref": "#/components/schemas/Key"
    ///          }
    ///        }
    ///      }
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct FileDownload {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub data: FileDownloadData,
        ///The database id file data if the inode is a file
        #[serde(rename = "dataId")]
        pub data_id: ::std::option::Option<::std::string::String>,
        ///The database id of the inode
        pub id: ::std::string::String,
        pub keys: ::std::vec::Vec<Key>,
        pub mnemonic: ::std::string::String,
        pub name: ::std::string::String,
        #[serde(rename = "parentId")]
        pub parent_id: ::serde_json::Value,
        pub tag: ::std::option::Option<::std::string::String>,
        ///The type of the inode
        #[serde(rename = "type")]
        pub type_: i32,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&FileDownload> for FileDownload {
        fn from(value: &FileDownload) -> Self {
            value.clone()
        }
    }
    ///`FileDownloadData`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "chunks",
    ///    "createdAt",
    ///    "createdBy",
    ///    "fileName",
    ///    "filePath",
    ///    "hash",
    ///    "id",
    ///    "keyHash",
    ///    "size",
    ///    "uid",
    ///    "updatedAt"
    ///  ],
    ///  "properties": {
    ///    "chunks": {
    ///      "type": "array",
    ///      "items": {
    ///        "$ref": "#/components/schemas/Chunk"
    ///      }
    ///    },
    ///    "createdAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "createdBy": {
    ///      "type": "string"
    ///    },
    ///    "fileName": {
    ///      "type": "string"
    ///    },
    ///    "filePath": {
    ///      "type": [
    ///        "null",
    ///        "string"
    ///      ]
    ///    },
    ///    "hash": {
    ///      "type": [
    ///        "null",
    ///        "string"
    ///      ]
    ///    },
    ///    "id": {
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "keyHash": {
    ///      "type": "string"
    ///    },
    ///    "size": {
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "uid": {
    ///      "type": "string"
    ///    },
    ///    "updatedAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct FileDownloadData {
        pub chunks: ::std::vec::Vec<Chunk>,
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        #[serde(rename = "createdBy")]
        pub created_by: ::std::string::String,
        #[serde(rename = "fileName")]
        pub file_name: ::std::string::String,
        #[serde(rename = "filePath")]
        pub file_path: ::std::option::Option<::std::string::String>,
        pub hash: ::std::option::Option<::std::string::String>,
        pub id: ::std::string::String,
        #[serde(rename = "keyHash")]
        pub key_hash: ::std::string::String,
        pub size: ::std::string::String,
        pub uid: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&FileDownloadData> for FileDownloadData {
        fn from(value: &FileDownloadData) -> Self {
            value.clone()
        }
    }
    ///`FileKeys`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "allOf": [
    ///    {
    ///      "$ref": "#/components/schemas/File"
    ///    },
    ///    {
    ///      "type": "object",
    ///      "required": [
    ///        "keys"
    ///      ],
    ///      "properties": {
    ///        "keys": {
    ///          "type": "array",
    ///          "items": {
    ///            "$ref": "#/components/schemas/Key"
    ///          }
    ///        }
    ///      }
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct FileKeys {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub data: FileKeysData,
        ///The database id file data if the inode is a file
        #[serde(rename = "dataId")]
        pub data_id: ::std::option::Option<::std::string::String>,
        ///The database id of the inode
        pub id: ::std::string::String,
        pub keys: ::std::vec::Vec<Key>,
        pub mnemonic: ::std::string::String,
        pub name: ::std::string::String,
        #[serde(rename = "parentId")]
        pub parent_id: ::serde_json::Value,
        pub tag: ::std::option::Option<::std::string::String>,
        ///The type of the inode
        #[serde(rename = "type")]
        pub type_: i32,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&FileKeys> for FileKeys {
        fn from(value: &FileKeys) -> Self {
            value.clone()
        }
    }
    ///`FileKeysData`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "allOf": [
    ///    {
    ///      "type": "object",
    ///      "required": [
    ///        "createdAt",
    ///        "createdBy",
    ///        "fileName",
    ///        "filePath",
    ///        "hash",
    ///        "id",
    ///        "keyHash",
    ///        "size",
    ///        "uid",
    ///        "updatedAt"
    ///      ],
    ///      "properties": {
    ///        "createdAt": {
    ///          "type": "string",
    ///          "format": "date-time"
    ///        },
    ///        "createdBy": {
    ///          "type": "string"
    ///        },
    ///        "fileName": {
    ///          "type": "string"
    ///        },
    ///        "filePath": {
    ///          "type": [
    ///            "string",
    ///            "null"
    ///          ]
    ///        },
    ///        "hash": {
    ///          "type": [
    ///            "string",
    ///            "null"
    ///          ]
    ///        },
    ///        "id": {
    ///          "description": "The database id of the file data",
    ///          "type": "string",
    ///          "format": "bigint"
    ///        },
    ///        "keyHash": {
    ///          "type": "string"
    ///        },
    ///        "size": {
    ///          "description": "The size of the file in bytes",
    ///          "type": "string",
    ///          "format": "bigint"
    ///        },
    ///        "uid": {
    ///          "type": "string"
    ///        },
    ///        "updatedAt": {
    ///          "type": "string",
    ///          "format": "date-time"
    ///        }
    ///      },
    ///      "additionalProperties": true
    ///    },
    ///    {
    ///      "allOf": [
    ///        {
    ///          "$ref": "#/components/schemas/FileData"
    ///        }
    ///      ]
    ///    },
    ///    {
    ///      "not": {
    ///        "type": "null"
    ///      }
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct FileKeysData {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        #[serde(rename = "createdBy")]
        pub created_by: ::std::string::String,
        #[serde(rename = "fileName")]
        pub file_name: ::std::string::String,
        #[serde(rename = "filePath")]
        pub file_path: ::std::option::Option<::std::string::String>,
        pub hash: ::std::option::Option<::std::string::String>,
        pub id: ::std::string::String,
        #[serde(rename = "keyHash")]
        pub key_hash: ::std::string::String,
        pub size: ::std::string::String,
        pub uid: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&FileKeysData> for FileKeysData {
        fn from(value: &FileKeysData) -> Self {
            value.clone()
        }
    }
    ///`FileUpload`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "allOf": [
    ///    {
    ///      "$ref": "#/components/schemas/File"
    ///    },
    ///    {
    ///      "type": "object",
    ///      "required": [
    ///        "data"
    ///      ],
    ///      "properties": {
    ///        "data": {
    ///          "$ref": "#/components/schemas/ChunkData"
    ///        }
    ///      }
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct FileUpload {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub data: FileUploadData,
        ///The database id file data if the inode is a file
        #[serde(rename = "dataId")]
        pub data_id: ::std::option::Option<::std::string::String>,
        ///The database id of the inode
        pub id: ::std::string::String,
        pub mnemonic: ::std::string::String,
        pub name: ::std::string::String,
        #[serde(rename = "parentId")]
        pub parent_id: ::serde_json::Value,
        pub tag: ::std::option::Option<::std::string::String>,
        ///The type of the inode
        #[serde(rename = "type")]
        pub type_: i32,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&FileUpload> for FileUpload {
        fn from(value: &FileUpload) -> Self {
            value.clone()
        }
    }
    ///`FileUploadData`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "chunks",
    ///    "createdAt",
    ///    "createdBy",
    ///    "fileName",
    ///    "filePath",
    ///    "hash",
    ///    "id",
    ///    "keyHash",
    ///    "size",
    ///    "uid",
    ///    "updatedAt"
    ///  ],
    ///  "properties": {
    ///    "chunks": {
    ///      "type": "array",
    ///      "items": {
    ///        "$ref": "#/components/schemas/Chunk"
    ///      }
    ///    },
    ///    "createdAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "createdBy": {
    ///      "type": "string"
    ///    },
    ///    "fileName": {
    ///      "type": "string"
    ///    },
    ///    "filePath": {
    ///      "type": [
    ///        "null",
    ///        "string"
    ///      ]
    ///    },
    ///    "hash": {
    ///      "type": [
    ///        "null",
    ///        "string"
    ///      ]
    ///    },
    ///    "id": {
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "keyHash": {
    ///      "type": "string"
    ///    },
    ///    "size": {
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "uid": {
    ///      "type": "string"
    ///    },
    ///    "updatedAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct FileUploadData {
        pub chunks: ::std::vec::Vec<Chunk>,
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        #[serde(rename = "createdBy")]
        pub created_by: ::std::string::String,
        #[serde(rename = "fileName")]
        pub file_name: ::std::string::String,
        #[serde(rename = "filePath")]
        pub file_path: ::std::option::Option<::std::string::String>,
        pub hash: ::std::option::Option<::std::string::String>,
        pub id: ::std::string::String,
        #[serde(rename = "keyHash")]
        pub key_hash: ::std::string::String,
        pub size: ::std::string::String,
        pub uid: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&FileUploadData> for FileUploadData {
        fn from(value: &FileUploadData) -> Self {
            value.clone()
        }
    }
    ///`HealthyResponse`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "healthy"
    ///  ],
    ///  "properties": {
    ///    "healthy": {
    ///      "type": "boolean"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct HealthyResponse {
        pub healthy: bool,
    }
    impl ::std::convert::From<&HealthyResponse> for HealthyResponse {
        fn from(value: &HealthyResponse) -> Self {
            value.clone()
        }
    }
    ///`Inode`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "createdAt",
    ///    "dataId",
    ///    "id",
    ///    "mnemonic",
    ///    "name",
    ///    "parentId",
    ///    "tag",
    ///    "type",
    ///    "updatedAt"
    ///  ],
    ///  "properties": {
    ///    "createdAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "data": {
    ///      "oneOf": [
    ///        {
    ///          "type": "null"
    ///        },
    ///        {
    ///          "allOf": [
    ///            {
    ///              "$ref": "#/components/schemas/FileData"
    ///            }
    ///          ]
    ///        }
    ///      ]
    ///    },
    ///    "dataId": {
    ///      "description": "The database id file data if the inode is a file",
    ///      "type": [
    ///        "string",
    ///        "null"
    ///      ],
    ///      "format": "bigint"
    ///    },
    ///    "id": {
    ///      "description": "The database id of the inode",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "mnemonic": {
    ///      "type": "string"
    ///    },
    ///    "name": {
    ///      "type": "string"
    ///    },
    ///    "parentId": {},
    ///    "tag": {
    ///      "type": [
    ///        "string",
    ///        "null"
    ///      ]
    ///    },
    ///    "type": {
    ///      "description": "The type of the inode",
    ///      "type": "integer",
    ///      "format": "int32",
    ///      "minimum": 0.0
    ///    },
    ///    "updatedAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct Inode {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub data: ::std::option::Option<FileData>,
        ///The database id file data if the inode is a file
        #[serde(rename = "dataId")]
        pub data_id: ::std::option::Option<::std::string::String>,
        ///The database id of the inode
        pub id: ::std::string::String,
        pub mnemonic: ::std::string::String,
        pub name: ::std::string::String,
        #[serde(rename = "parentId")]
        pub parent_id: ::serde_json::Value,
        pub tag: ::std::option::Option<::std::string::String>,
        ///The type of the inode
        #[serde(rename = "type")]
        pub type_: i32,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&Inode> for Inode {
        fn from(value: &Inode) -> Self {
            value.clone()
        }
    }
    ///`InodeMembers`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "allOf": [
    ///    {
    ///      "$ref": "#/components/schemas/Inode"
    ///    },
    ///    {
    ///      "type": "object",
    ///      "required": [
    ///        "members"
    ///      ],
    ///      "properties": {
    ///        "members": {
    ///          "type": "array",
    ///          "items": {
    ///            "$ref": "#/components/schemas/Member"
    ///          }
    ///        }
    ///      }
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct InodeMembers {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub data: ::std::option::Option<FileData>,
        ///The database id file data if the inode is a file
        #[serde(rename = "dataId")]
        pub data_id: ::std::option::Option<::std::string::String>,
        ///The database id of the inode
        pub id: ::std::string::String,
        pub members: ::std::vec::Vec<Member>,
        pub mnemonic: ::std::string::String,
        pub name: ::std::string::String,
        #[serde(rename = "parentId")]
        pub parent_id: ::serde_json::Value,
        pub tag: ::std::option::Option<::std::string::String>,
        ///The type of the inode
        #[serde(rename = "type")]
        pub type_: i32,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&InodeMembers> for InodeMembers {
        fn from(value: &InodeMembers) -> Self {
            value.clone()
        }
    }
    ///`InodeSearchBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "query"
    ///  ],
    ///  "properties": {
    ///    "query": {
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct InodeSearchBody {
        pub query: ::std::string::String,
    }
    impl ::std::convert::From<&InodeSearchBody> for InodeSearchBody {
        fn from(value: &InodeSearchBody) -> Self {
            value.clone()
        }
    }
    ///`InodeSearchResults`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "inodes",
    ///    "isComplete"
    ///  ],
    ///  "properties": {
    ///    "inodes": {
    ///      "description": "The list of inodes that match the search query",
    ///      "type": "array",
    ///      "items": {
    ///        "$ref": "#/components/schemas/Inode"
    ///      }
    ///    },
    ///    "isComplete": {
    ///      "type": "boolean"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct InodeSearchResults {
        ///The list of inodes that match the search query
        pub inodes: ::std::vec::Vec<Inode>,
        #[serde(rename = "isComplete")]
        pub is_complete: bool,
    }
    impl ::std::convert::From<&InodeSearchResults> for InodeSearchResults {
        fn from(value: &InodeSearchResults) -> Self {
            value.clone()
        }
    }
    ///`InodeTree`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "allOf": [
    ///    {
    ///      "$ref": "#/components/schemas/InodeMembers"
    ///    },
    ///    {
    ///      "type": "object",
    ///      "required": [
    ///        "keys"
    ///      ],
    ///      "properties": {
    ///        "children": {
    ///          "type": "array",
    ///          "items": {
    ///            "$ref": "#/components/schemas/InodeTree"
    ///          }
    ///        },
    ///        "keys": {
    ///          "type": "array",
    ///          "items": {
    ///            "$ref": "#/components/schemas/Key"
    ///          }
    ///        }
    ///      }
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct InodeTree {
        #[serde(default, skip_serializing_if = "::std::vec::Vec::is_empty")]
        pub children: ::std::vec::Vec<InodeTree>,
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub data: ::std::option::Option<FileData>,
        ///The database id file data if the inode is a file
        #[serde(rename = "dataId")]
        pub data_id: ::std::option::Option<::std::string::String>,
        ///The database id of the inode
        pub id: ::std::string::String,
        pub keys: ::std::vec::Vec<Key>,
        pub members: ::std::vec::Vec<Member>,
        pub mnemonic: ::std::string::String,
        pub name: ::std::string::String,
        #[serde(rename = "parentId")]
        pub parent_id: ::serde_json::Value,
        pub tag: ::std::option::Option<::std::string::String>,
        ///The type of the inode
        #[serde(rename = "type")]
        pub type_: i32,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&InodeTree> for InodeTree {
        fn from(value: &InodeTree) -> Self {
            value.clone()
        }
    }
    ///`IntegrityCheckResult`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "missing",
    ///    "unknown"
    ///  ],
    ///  "properties": {
    ///    "missing": {
    ///      "description": "list of file data uids that are not referenced by a corresponding bucket\nTHIS LIST SHOULD BE EMPTY if not it indicates a serious issue",
    ///      "type": "array",
    ///      "items": {
    ///        "type": "string"
    ///      }
    ///    },
    ///    "unknown": {
    ///      "description": "list of buckets that do not have corresponding filedata in the database\nthis list should be empty, if not these files are orphaned and can be removed",
    ///      "type": "array",
    ///      "items": {
    ///        "type": "string"
    ///      }
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct IntegrityCheckResult {
        /**list of file data uids that are not referenced by a corresponding bucket
THIS LIST SHOULD BE EMPTY if not it indicates a serious issue*/
        pub missing: ::std::vec::Vec<::std::string::String>,
        /**list of buckets that do not have corresponding filedata in the database
this list should be empty, if not these files are orphaned and can be removed*/
        pub unknown: ::std::vec::Vec<::std::string::String>,
    }
    impl ::std::convert::From<&IntegrityCheckResult> for IntegrityCheckResult {
        fn from(value: &IntegrityCheckResult) -> Self {
            value.clone()
        }
    }
    ///`Job`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "jobId",
    ///    "status"
    ///  ],
    ///  "properties": {
    ///    "jobId": {
    ///      "type": "string"
    ///    },
    ///    "status": {
    ///      "$ref": "#/components/schemas/JobStatus"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct Job {
        #[serde(rename = "jobId")]
        pub job_id: ::std::string::String,
        pub status: JobStatus,
    }
    impl ::std::convert::From<&Job> for Job {
        fn from(value: &Job) -> Self {
            value.clone()
        }
    }
    ///`JobStatus`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "string",
    ///  "enum": [
    ///    "running",
    ///    "complete",
    ///    "failed"
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(
        ::serde::Deserialize,
        ::serde::Serialize,
        Clone,
        Copy,
        Debug,
        Eq,
        Hash,
        Ord,
        PartialEq,
        PartialOrd
    )]
    pub enum JobStatus {
        #[serde(rename = "running")]
        Running,
        #[serde(rename = "complete")]
        Complete,
        #[serde(rename = "failed")]
        Failed,
    }
    impl ::std::convert::From<&Self> for JobStatus {
        fn from(value: &JobStatus) -> Self {
            value.clone()
        }
    }
    impl ::std::fmt::Display for JobStatus {
        fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
            match *self {
                Self::Running => f.write_str("running"),
                Self::Complete => f.write_str("complete"),
                Self::Failed => f.write_str("failed"),
            }
        }
    }
    impl ::std::str::FromStr for JobStatus {
        type Err = self::error::ConversionError;
        fn from_str(
            value: &str,
        ) -> ::std::result::Result<Self, self::error::ConversionError> {
            match value {
                "running" => Ok(Self::Running),
                "complete" => Ok(Self::Complete),
                "failed" => Ok(Self::Failed),
                _ => Err("invalid value".into()),
            }
        }
    }
    impl ::std::convert::TryFrom<&str> for JobStatus {
        type Error = self::error::ConversionError;
        fn try_from(
            value: &str,
        ) -> ::std::result::Result<Self, self::error::ConversionError> {
            value.parse()
        }
    }
    impl ::std::convert::TryFrom<&::std::string::String> for JobStatus {
        type Error = self::error::ConversionError;
        fn try_from(
            value: &::std::string::String,
        ) -> ::std::result::Result<Self, self::error::ConversionError> {
            value.parse()
        }
    }
    impl ::std::convert::TryFrom<::std::string::String> for JobStatus {
        type Error = self::error::ConversionError;
        fn try_from(
            value: ::std::string::String,
        ) -> ::std::result::Result<Self, self::error::ConversionError> {
            value.parse()
        }
    }
    ///`Key`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "createdAt",
    ///    "hash",
    ///    "id",
    ///    "inodeId",
    ///    "key",
    ///    "updatedAt"
    ///  ],
    ///  "properties": {
    ///    "createdAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "hash": {
    ///      "type": "string"
    ///    },
    ///    "id": {
    ///      "description": "The database id of the key",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "inodeId": {
    ///      "description": "The inode id the key belongs to",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "key": {
    ///      "type": "string"
    ///    },
    ///    "updatedAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct Key {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub hash: ::std::string::String,
        ///The database id of the key
        pub id: ::std::string::String,
        ///The inode id the key belongs to
        #[serde(rename = "inodeId")]
        pub inode_id: ::std::string::String,
        pub key: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&Key> for Key {
        fn from(value: &Key) -> Self {
            value.clone()
        }
    }
    ///`KeyAddBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "data",
    ///    "isRootKey",
    ///    "sub"
    ///  ],
    ///  "properties": {
    ///    "data": {
    ///      "$ref": "#/components/schemas/crypto.JsonWebKey"
    ///    },
    ///    "isRootKey": {
    ///      "description": "If true the key is a root key, used to decrypt all datasets",
    ///      "type": "boolean"
    ///    },
    ///    "sub": {
    ///      "description": "The user the key should belong to",
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct KeyAddBody {
        pub data: CryptoJsonWebKey,
        ///If true the key is a root key, used to decrypt all datasets
        #[serde(rename = "isRootKey")]
        pub is_root_key: bool,
        ///The user the key should belong to
        pub sub: ::std::string::String,
    }
    impl ::std::convert::From<&KeyAddBody> for KeyAddBody {
        fn from(value: &KeyAddBody) -> Self {
            value.clone()
        }
    }
    ///`KeyEnableBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "enabled",
    ///    "hash",
    ///    "sub"
    ///  ],
    ///  "properties": {
    ///    "enabled": {
    ///      "description": "The key status to set",
    ///      "type": "boolean"
    ///    },
    ///    "hash": {
    ///      "description": "The hash of the key",
    ///      "type": "string"
    ///    },
    ///    "sub": {
    ///      "description": "The user the key belongs to",
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct KeyEnableBody {
        ///The key status to set
        pub enabled: bool,
        ///The hash of the key
        pub hash: ::std::string::String,
        ///The user the key belongs to
        pub sub: ::std::string::String,
    }
    impl ::std::convert::From<&KeyEnableBody> for KeyEnableBody {
        fn from(value: &KeyEnableBody) -> Self {
            value.clone()
        }
    }
    ///`KeyRemoveBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "hash",
    ///    "sub"
    ///  ],
    ///  "properties": {
    ///    "hash": {
    ///      "description": "The hash of the key",
    ///      "type": "string"
    ///    },
    ///    "sub": {
    ///      "description": "The user the key belongs to",
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct KeyRemoveBody {
        ///The hash of the key
        pub hash: ::std::string::String,
        ///The user the key belongs to
        pub sub: ::std::string::String,
    }
    impl ::std::convert::From<&KeyRemoveBody> for KeyRemoveBody {
        fn from(value: &KeyRemoveBody) -> Self {
            value.clone()
        }
    }
    ///`ListResponse`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "children",
    ///    "parents"
    ///  ],
    ///  "properties": {
    ///    "children": {
    ///      "description": "The list of inodes in the directory",
    ///      "type": "array",
    ///      "items": {
    ///        "$ref": "#/components/schemas/InodeMembers"
    ///      }
    ///    },
    ///    "parents": {
    ///      "description": "The list of parent directories",
    ///      "type": "array",
    ///      "items": {
    ///        "$ref": "#/components/schemas/InodeMembers"
    ///      }
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct ListResponse {
        ///The list of inodes in the directory
        pub children: ::std::vec::Vec<InodeMembers>,
        ///The list of parent directories
        pub parents: ::std::vec::Vec<InodeMembers>,
    }
    impl ::std::convert::From<&ListResponse> for ListResponse {
        fn from(value: &ListResponse) -> Self {
            value.clone()
        }
    }
    ///`Member`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "createdAt",
    ///    "id",
    ///    "inodeId",
    ///    "permission",
    ///    "sub",
    ///    "updatedAt"
    ///  ],
    ///  "properties": {
    ///    "createdAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "id": {
    ///      "description": "The database id of the member",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "inodeId": {
    ///      "description": "The database id of the inode",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "permission": {
    ///      "type": "number",
    ///      "format": "double"
    ///    },
    ///    "sub": {
    ///      "type": "string"
    ///    },
    ///    "updatedAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct Member {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        ///The database id of the member
        pub id: ::std::string::String,
        ///The database id of the inode
        #[serde(rename = "inodeId")]
        pub inode_id: ::std::string::String,
        pub permission: f64,
        pub sub: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&Member> for Member {
        fn from(value: &Member) -> Self {
            value.clone()
        }
    }
    ///`MemberAddBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "keys",
    ///    "subs"
    ///  ],
    ///  "properties": {
    ///    "keys": {
    ///      "description": "The list of AES-256 keys required to decrypt all child datasets",
    ///      "type": "array",
    ///      "items": {
    ///        "$ref": "#/components/schemas/FileDecryptionKey"
    ///      }
    ///    },
    ///    "subs": {
    ///      "description": "The users to add to the dataset",
    ///      "type": "array",
    ///      "items": {
    ///        "type": "string"
    ///      }
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct MemberAddBody {
        ///The list of AES-256 keys required to decrypt all child datasets
        pub keys: ::std::vec::Vec<FileDecryptionKey>,
        ///The users to add to the dataset
        pub subs: ::std::vec::Vec<::std::string::String>,
    }
    impl ::std::convert::From<&MemberAddBody> for MemberAddBody {
        fn from(value: &MemberAddBody) -> Self {
            value.clone()
        }
    }
    ///`MoveInodeBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "mnemonic"
    ///  ],
    ///  "properties": {
    ///    "keys": {
    ///      "description": "The list of AES-256 keys required to decrypt all child datasets",
    ///      "type": "array",
    ///      "items": {
    ///        "$ref": "#/components/schemas/FileDecryptionKey"
    ///      }
    ///    },
    ///    "mnemonic": {
    ///      "description": "The mnemonic of the inode to move",
    ///      "type": "string"
    ///    },
    ///    "name": {
    ///      "description": "Optional: The new name of the inode",
    ///      "type": "string"
    ///    },
    ///    "parent": {
    ///      "description": "Optional: The mnemonic of the new parent directory",
    ///      "type": [
    ///        "string",
    ///        "null"
    ///      ]
    ///    },
    ///    "tag": {
    ///      "description": "Optional: The new tag of the inode",
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct MoveInodeBody {
        ///The list of AES-256 keys required to decrypt all child datasets
        #[serde(default, skip_serializing_if = "::std::vec::Vec::is_empty")]
        pub keys: ::std::vec::Vec<FileDecryptionKey>,
        ///The mnemonic of the inode to move
        pub mnemonic: ::std::string::String,
        ///Optional: The new name of the inode
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub name: ::std::option::Option<::std::string::String>,
        ///Optional: The mnemonic of the new parent directory
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub parent: ::std::option::Option<::std::string::String>,
        ///Optional: The new tag of the inode
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub tag: ::std::option::Option<::std::string::String>,
    }
    impl ::std::convert::From<&MoveInodeBody> for MoveInodeBody {
        fn from(value: &MoveInodeBody) -> Self {
            value.clone()
        }
    }
    ///`PublicKey`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "createdAt",
    ///    "data",
    ///    "enabled",
    ///    "enabledBy",
    ///    "hash",
    ///    "id",
    ///    "isRootKey",
    ///    "updatedAt",
    ///    "userId"
    ///  ],
    ///  "properties": {
    ///    "createdAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "data": {
    ///      "type": "string"
    ///    },
    ///    "enabled": {
    ///      "type": [
    ///        "string",
    ///        "null"
    ///      ],
    ///      "format": "date-time"
    ///    },
    ///    "enabledBy": {
    ///      "type": [
    ///        "string",
    ///        "null"
    ///      ]
    ///    },
    ///    "hash": {
    ///      "type": "string"
    ///    },
    ///    "id": {
    ///      "description": "The database id of the public key",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "isRootKey": {
    ///      "type": "boolean"
    ///    },
    ///    "updatedAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "userId": {
    ///      "description": "The user id the key belongs to",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct PublicKey {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub data: ::std::string::String,
        pub enabled: ::std::option::Option<::chrono::DateTime<::chrono::offset::Utc>>,
        #[serde(rename = "enabledBy")]
        pub enabled_by: ::std::option::Option<::std::string::String>,
        pub hash: ::std::string::String,
        ///The database id of the public key
        pub id: ::std::string::String,
        #[serde(rename = "isRootKey")]
        pub is_root_key: bool,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
        ///The user id the key belongs to
        #[serde(rename = "userId")]
        pub user_id: ::std::string::String,
    }
    impl ::std::convert::From<&PublicKey> for PublicKey {
        fn from(value: &PublicKey) -> Self {
            value.clone()
        }
    }
    ///`RemoveTokenBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "tokenId"
    ///  ],
    ///  "properties": {
    ///    "tokenId": {
    ///      "type": "string"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct RemoveTokenBody {
        #[serde(rename = "tokenId")]
        pub token_id: ::std::string::String,
    }
    impl ::std::convert::From<&RemoveTokenBody> for RemoveTokenBody {
        fn from(value: &RemoveTokenBody) -> Self {
            value.clone()
        }
    }
    ///`SearchFsResponse`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "jobId"
    ///  ],
    ///  "properties": {
    ///    "jobId": {
    ///      "type": "string"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct SearchFsResponse {
        #[serde(rename = "jobId")]
        pub job_id: ::std::string::String,
    }
    impl ::std::convert::From<&SearchFsResponse> for SearchFsResponse {
        fn from(value: &SearchFsResponse) -> Self {
            value.clone()
        }
    }
    ///`SetAccessBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "permission",
    ///    "sub"
    ///  ],
    ///  "properties": {
    ///    "permission": {
    ///      "description": "The permission to set",
    ///      "type": "number",
    ///      "format": "double"
    ///    },
    ///    "sub": {
    ///      "description": "The user to set the permission for",
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct SetAccessBody {
        pub permission: f64,
        ///The user to set the permission for
        pub sub: ::std::string::String,
    }
    impl ::std::convert::From<&SetAccessBody> for SetAccessBody {
        fn from(value: &SetAccessBody) -> Self {
            value.clone()
        }
    }
    ///`SignInBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "email"
    ///  ],
    ///  "properties": {
    ///    "email": {
    ///      "type": "string"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct SignInBody {
        pub email: ::std::string::String,
    }
    impl ::std::convert::From<&SignInBody> for SignInBody {
        fn from(value: &SignInBody) -> Self {
            value.clone()
        }
    }
    ///`SignInResponse`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "status"
    ///  ],
    ///  "properties": {
    ///    "status": {
    ///      "type": "string",
    ///      "enum": [
    ///        "success",
    ///        "email_sent",
    ///        "error"
    ///      ]
    ///    },
    ///    "token": {
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct SignInResponse {
        pub status: SignInResponseStatus,
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub token: ::std::option::Option<::std::string::String>,
    }
    impl ::std::convert::From<&SignInResponse> for SignInResponse {
        fn from(value: &SignInResponse) -> Self {
            value.clone()
        }
    }
    ///`SignInResponseStatus`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "string",
    ///  "enum": [
    ///    "success",
    ///    "email_sent",
    ///    "error"
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(
        ::serde::Deserialize,
        ::serde::Serialize,
        Clone,
        Copy,
        Debug,
        Eq,
        Hash,
        Ord,
        PartialEq,
        PartialOrd
    )]
    pub enum SignInResponseStatus {
        #[serde(rename = "success")]
        Success,
        #[serde(rename = "email_sent")]
        EmailSent,
        #[serde(rename = "error")]
        Error,
    }
    impl ::std::convert::From<&Self> for SignInResponseStatus {
        fn from(value: &SignInResponseStatus) -> Self {
            value.clone()
        }
    }
    impl ::std::fmt::Display for SignInResponseStatus {
        fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
            match *self {
                Self::Success => f.write_str("success"),
                Self::EmailSent => f.write_str("email_sent"),
                Self::Error => f.write_str("error"),
            }
        }
    }
    impl ::std::str::FromStr for SignInResponseStatus {
        type Err = self::error::ConversionError;
        fn from_str(
            value: &str,
        ) -> ::std::result::Result<Self, self::error::ConversionError> {
            match value {
                "success" => Ok(Self::Success),
                "email_sent" => Ok(Self::EmailSent),
                "error" => Ok(Self::Error),
                _ => Err("invalid value".into()),
            }
        }
    }
    impl ::std::convert::TryFrom<&str> for SignInResponseStatus {
        type Error = self::error::ConversionError;
        fn try_from(
            value: &str,
        ) -> ::std::result::Result<Self, self::error::ConversionError> {
            value.parse()
        }
    }
    impl ::std::convert::TryFrom<&::std::string::String> for SignInResponseStatus {
        type Error = self::error::ConversionError;
        fn try_from(
            value: &::std::string::String,
        ) -> ::std::result::Result<Self, self::error::ConversionError> {
            value.parse()
        }
    }
    impl ::std::convert::TryFrom<::std::string::String> for SignInResponseStatus {
        type Error = self::error::ConversionError;
        fn try_from(
            value: ::std::string::String,
        ) -> ::std::result::Result<Self, self::error::ConversionError> {
            value.parse()
        }
    }
    ///`Token`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "createdAt",
    ///    "exp",
    ///    "id",
    ///    "scope",
    ///    "sub",
    ///    "updatedAt",
    ///    "value"
    ///  ],
    ///  "properties": {
    ///    "createdAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "exp": {
    ///      "type": [
    ///        "string",
    ///        "null"
    ///      ],
    ///      "format": "date-time"
    ///    },
    ///    "id": {
    ///      "description": "The id of the token",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "scope": {
    ///      "type": "string"
    ///    },
    ///    "sub": {
    ///      "type": "string"
    ///    },
    ///    "updatedAt": {
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "value": {
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct Token {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub exp: ::std::option::Option<::chrono::DateTime<::chrono::offset::Utc>>,
        ///The id of the token
        pub id: ::std::string::String,
        pub scope: ::std::string::String,
        pub sub: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub value: ::std::string::String,
    }
    impl ::std::convert::From<&Token> for Token {
        fn from(value: &Token) -> Self {
            value.clone()
        }
    }
    ///`TokenAddBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "lifetime",
    ///    "scopes"
    ///  ],
    ///  "properties": {
    ///    "lifetime": {
    ///      "description": "The time in seconds the token should be valid for\nIf null the token will never expire",
    ///      "type": [
    ///        "integer",
    ///        "null"
    ///      ],
    ///      "format": "int64",
    ///      "minimum": 0.0
    ///    },
    ///    "scopes": {
    ///      "description": "The array of scopes the token should have",
    ///      "type": "array",
    ///      "items": {
    ///        "type": "string"
    ///      }
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct TokenAddBody {
        /**The time in seconds the token should be valid for
If null the token will never expire*/
        pub lifetime: ::std::option::Option<i64>,
        ///The array of scopes the token should have
        pub scopes: ::std::vec::Vec<::std::string::String>,
    }
    impl ::std::convert::From<&TokenAddBody> for TokenAddBody {
        fn from(value: &TokenAddBody) -> Self {
            value.clone()
        }
    }
    ///`TokenResponse`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "allOf": [
    ///    {
    ///      "$ref": "#/components/schemas/Token"
    ///    },
    ///    {
    ///      "type": "object",
    ///      "required": [
    ///        "expired",
    ///        "scopes"
    ///      ],
    ///      "properties": {
    ///        "expired": {
    ///          "description": "false if the token has not expired,\notherwise a string describing how long ago the token expired",
    ///          "anyOf": [
    ///            {
    ///              "type": "string"
    ///            },
    ///            {
    ///              "type": "boolean",
    ///              "enum": [
    ///                false
    ///              ]
    ///            }
    ///          ]
    ///        },
    ///        "scopes": {
    ///          "description": "The array of scopes the token has",
    ///          "type": "array",
    ///          "items": {
    ///            "type": "string"
    ///          }
    ///        }
    ///      }
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct TokenResponse {
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub exp: ::std::option::Option<::chrono::DateTime<::chrono::offset::Utc>>,
        /**false if the token has not expired,
otherwise a string describing how long ago the token expired*/
        pub expired: TokenResponseExpired,
        ///The id of the token
        pub id: ::std::string::String,
        pub scope: ::std::string::String,
        ///The array of scopes the token has
        pub scopes: ::std::vec::Vec<::std::string::String>,
        pub sub: ::std::string::String,
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
        pub value: ::std::string::String,
    }
    impl ::std::convert::From<&TokenResponse> for TokenResponse {
        fn from(value: &TokenResponse) -> Self {
            value.clone()
        }
    }
    /**false if the token has not expired,
otherwise a string describing how long ago the token expired*/
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "description": "false if the token has not expired,\notherwise a string describing how long ago the token expired",
    ///  "anyOf": [
    ///    {
    ///      "type": "string"
    ///    },
    ///    {
    ///      "type": "boolean",
    ///      "enum": [
    ///        false
    ///      ]
    ///    }
    ///  ]
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    #[serde(untagged)]
    pub enum TokenResponseExpired {
        Variant0(::std::string::String),
        Variant1(bool),
    }
    impl ::std::convert::From<&Self> for TokenResponseExpired {
        fn from(value: &TokenResponseExpired) -> Self {
            value.clone()
        }
    }
    impl ::std::fmt::Display for TokenResponseExpired {
        fn fmt(&self, f: &mut ::std::fmt::Formatter<'_>) -> ::std::fmt::Result {
            match self {
                Self::Variant0(x) => x.fmt(f),
                Self::Variant1(x) => x.fmt(f),
            }
        }
    }
    impl ::std::convert::From<bool> for TokenResponseExpired {
        fn from(value: bool) -> Self {
            Self::Variant1(value)
        }
    }
    ///`UploadStartBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "fileName"
    ///  ],
    ///  "properties": {
    ///    "directory": {
    ///      "description": "The mnemonic of the directory to upload the file to",
    ///      "type": "string"
    ///    },
    ///    "fileName": {
    ///      "description": "The name of the file to upload",
    ///      "type": "string"
    ///    },
    ///    "filePath": {
    ///      "description": "The original path of the file",
    ///      "type": "string"
    ///    },
    ///    "size": {
    ///      "description": "The size of the file in bytes",
    ///      "type": "integer",
    ///      "format": "int64",
    ///      "minimum": 0.0
    ///    },
    ///    "tag": {
    ///      "description": "A custom searchable tag for the file",
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct UploadStartBody {
        ///The mnemonic of the directory to upload the file to
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub directory: ::std::option::Option<::std::string::String>,
        ///The name of the file to upload
        #[serde(rename = "fileName")]
        pub file_name: ::std::string::String,
        ///The original path of the file
        #[serde(
            rename = "filePath",
            default,
            skip_serializing_if = "::std::option::Option::is_none"
        )]
        pub file_path: ::std::option::Option<::std::string::String>,
        ///The size of the file in bytes
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub size: ::std::option::Option<i64>,
        ///A custom searchable tag for the file
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub tag: ::std::option::Option<::std::string::String>,
    }
    impl ::std::convert::From<&UploadStartBody> for UploadStartBody {
        fn from(value: &UploadStartBody) -> Self {
            value.clone()
        }
    }
    ///User is the type that represents a user in the system.
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "description": "User is the type that represents a user in the system.",
    ///  "type": "object",
    ///  "required": [
    ///    "isAdmin",
    ///    "scopes",
    ///    "sub"
    ///  ],
    ///  "properties": {
    ///    "isAdmin": {
    ///      "description": "Does the user have the dabih:admin scope",
    ///      "type": "boolean"
    ///    },
    ///    "scopes": {
    ///      "description": "The scopes the user has",
    ///      "examples": [
    ///        [
    ///          "dabih:api"
    ///        ]
    ///      ],
    ///      "type": "array",
    ///      "items": {
    ///        "type": "string"
    ///      }
    ///    },
    ///    "sub": {
    ///      "description": "The subject of the user, a unique identifier",
    ///      "examples": [
    ///        "mhuttner"
    ///      ],
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct User {
        ///Does the user have the dabih:admin scope
        #[serde(rename = "isAdmin")]
        pub is_admin: bool,
        ///The scopes the user has
        pub scopes: ::std::vec::Vec<::std::string::String>,
        ///The subject of the user, a unique identifier
        pub sub: ::std::string::String,
    }
    impl ::std::convert::From<&User> for User {
        fn from(value: &User) -> Self {
            value.clone()
        }
    }
    ///`UserAddBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "email",
    ///    "key"
    ///  ],
    ///  "properties": {
    ///    "email": {
    ///      "description": "The email of the user",
    ///      "type": "string"
    ///    },
    ///    "isRootKey": {
    ///      "description": "If true the key is a root key, used to decrypt all datasets",
    ///      "type": "boolean"
    ///    },
    ///    "key": {
    ///      "$ref": "#/components/schemas/crypto.JsonWebKey"
    ///    },
    ///    "sub": {
    ///      "description": "The unique user sub\nif undefined the sub from the auth token will be used",
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct UserAddBody {
        ///The email of the user
        pub email: ::std::string::String,
        ///If true the key is a root key, used to decrypt all datasets
        #[serde(
            rename = "isRootKey",
            default,
            skip_serializing_if = "::std::option::Option::is_none"
        )]
        pub is_root_key: ::std::option::Option<bool>,
        pub key: CryptoJsonWebKey,
        /**The unique user sub
if undefined the sub from the auth token will be used*/
        #[serde(default, skip_serializing_if = "::std::option::Option::is_none")]
        pub sub: ::std::option::Option<::std::string::String>,
    }
    impl ::std::convert::From<&UserAddBody> for UserAddBody {
        fn from(value: &UserAddBody) -> Self {
            value.clone()
        }
    }
    ///`UserResponse`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "createdAt",
    ///    "email",
    ///    "id",
    ///    "keys",
    ///    "lastAuthAt",
    ///    "scope",
    ///    "sub",
    ///    "updatedAt"
    ///  ],
    ///  "properties": {
    ///    "createdAt": {
    ///      "description": "The date the user was created",
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "email": {
    ///      "description": "The email of the user",
    ///      "type": "string"
    ///    },
    ///    "id": {
    ///      "description": "The database id of the user",
    ///      "type": "string",
    ///      "format": "bigint"
    ///    },
    ///    "keys": {
    ///      "description": "The public keys of the user",
    ///      "type": "array",
    ///      "items": {
    ///        "$ref": "#/components/schemas/PublicKey"
    ///      }
    ///    },
    ///    "lastAuthAt": {
    ///      "description": "The time of the last authentication",
    ///      "type": "string",
    ///      "format": "date-time"
    ///    },
    ///    "scope": {
    ///      "description": "the list of scopes the user has",
    ///      "type": "string"
    ///    },
    ///    "sub": {
    ///      "description": "The unique user sub",
    ///      "type": "string"
    ///    },
    ///    "updatedAt": {
    ///      "description": "The date the user was last updated",
    ///      "type": "string",
    ///      "format": "date-time"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct UserResponse {
        ///The date the user was created
        #[serde(rename = "createdAt")]
        pub created_at: ::chrono::DateTime<::chrono::offset::Utc>,
        ///The email of the user
        pub email: ::std::string::String,
        ///The database id of the user
        pub id: ::std::string::String,
        ///The public keys of the user
        pub keys: ::std::vec::Vec<PublicKey>,
        ///The time of the last authentication
        #[serde(rename = "lastAuthAt")]
        pub last_auth_at: ::chrono::DateTime<::chrono::offset::Utc>,
        ///the list of scopes the user has
        pub scope: ::std::string::String,
        ///The unique user sub
        pub sub: ::std::string::String,
        ///The date the user was last updated
        #[serde(rename = "updatedAt")]
        pub updated_at: ::chrono::DateTime<::chrono::offset::Utc>,
    }
    impl ::std::convert::From<&UserResponse> for UserResponse {
        fn from(value: &UserResponse) -> Self {
            value.clone()
        }
    }
    ///`UserSub`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "sub"
    ///  ],
    ///  "properties": {
    ///    "sub": {
    ///      "type": "string"
    ///    }
    ///  },
    ///  "additionalProperties": true
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct UserSub {
        pub sub: ::std::string::String,
    }
    impl ::std::convert::From<&UserSub> for UserSub {
        fn from(value: &UserSub) -> Self {
            value.clone()
        }
    }
    ///`VerifyEmailBody`
    ///
    /// <details><summary>JSON schema</summary>
    ///
    /// ```json
    ///{
    ///  "type": "object",
    ///  "required": [
    ///    "token"
    ///  ],
    ///  "properties": {
    ///    "token": {
    ///      "type": "string"
    ///    }
    ///  }
    ///}
    /// ```
    /// </details>
    #[derive(::serde::Deserialize, ::serde::Serialize, Clone, Debug)]
    pub struct VerifyEmailBody {
        pub token: ::std::string::String,
    }
    impl ::std::convert::From<&VerifyEmailBody> for VerifyEmailBody {
        fn from(value: &VerifyEmailBody) -> Self {
            value.clone()
        }
    }
}
#[derive(Clone, Debug)]
/**Client for dabih-api

Dabih API Server

Version: 2.2.1*/
pub struct Client {
    pub(crate) baseurl: String,
    pub(crate) client: reqwest::Client,
}
impl Client {
    /// Create a new client.
    ///
    /// `baseurl` is the base URL provided to the internal
    /// `reqwest::Client`, and should include a scheme and hostname,
    /// as well as port and a path stem if applicable.
    pub fn new(baseurl: &str) -> Self {
        #[cfg(not(target_arch = "wasm32"))]
        let client = {
            let dur = std::time::Duration::from_secs(15);
            reqwest::ClientBuilder::new().connect_timeout(dur).timeout(dur)
        };
        #[cfg(target_arch = "wasm32")]
        let client = reqwest::ClientBuilder::new();
        Self::new_with_client(baseurl, client.build().unwrap())
    }
    /// Construct a new client with an existing `reqwest::Client`,
    /// allowing more control over its configuration.
    ///
    /// `baseurl` is the base URL provided to the internal
    /// `reqwest::Client`, and should include a scheme and hostname,
    /// as well as port and a path stem if applicable.
    pub fn new_with_client(baseurl: &str, client: reqwest::Client) -> Self {
        Self {
            baseurl: baseurl.to_string(),
            client,
        }
    }
}
impl ClientInfo<()> for Client {
    fn api_version() -> &'static str {
        "2.2.1"
    }
    fn baseurl(&self) -> &str {
        self.baseurl.as_str()
    }
    fn client(&self) -> &reqwest::Client {
        &self.client
    }
    fn inner(&self) -> &() {
        &()
    }
}
impl ClientHooks<()> for &Client {}
#[allow(clippy::all)]
impl Client {
    /**Sends a `GET` request to `/healthy`

*/
    pub async fn healthy<'a>(
        &'a self,
    ) -> Result<ResponseValue<types::HealthyResponse>, Error<()>> {
        let url = format!("{}/healthy", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "healthy",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/info`

*/
    pub async fn info<'a>(
        &'a self,
    ) -> Result<ResponseValue<types::DabihInfo>, Error<()>> {
        let url = format!("{}/info", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "info",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/user/add`

*/
    pub async fn add_user<'a>(
        &'a self,
        body: &'a types::UserAddBody,
    ) -> Result<ResponseValue<types::UserResponse>, Error<()>> {
        let url = format!("{}/user/add", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "add_user",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            201u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/user/me`

*/
    pub async fn me<'a>(
        &'a self,
    ) -> Result<ResponseValue<::std::option::Option<types::UserResponse>>, Error<()>> {
        let url = format!("{}/user/me", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "me",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/user/find`

*/
    pub async fn find_user<'a>(
        &'a self,
        body: &'a types::UserSub,
    ) -> Result<ResponseValue<::std::option::Option<types::UserResponse>>, Error<()>> {
        let url = format!("{}/user/find", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "find_user",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/user/list`

*/
    pub async fn list_users<'a>(
        &'a self,
    ) -> Result<ResponseValue<::std::vec::Vec<types::UserResponse>>, Error<()>> {
        let url = format!("{}/user/list", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "list_users",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/user/remove`

*/
    pub async fn remove_user<'a>(
        &'a self,
        body: &'a types::UserSub,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!("{}/user/remove", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).json(&body).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "remove_user",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/user/key/add`

*/
    pub async fn add_key<'a>(
        &'a self,
        body: &'a types::KeyAddBody,
    ) -> Result<ResponseValue<types::PublicKey>, Error<()>> {
        let url = format!("{}/user/key/add", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "add_key",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            201u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/user/key/enable`

*/
    pub async fn enable_key<'a>(
        &'a self,
        body: &'a types::KeyEnableBody,
    ) -> Result<ResponseValue<types::PublicKey>, Error<()>> {
        let url = format!("{}/user/key/enable", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "enable_key",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/user/key/remove`

*/
    pub async fn remove_key<'a>(
        &'a self,
        body: &'a types::KeyRemoveBody,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!("{}/user/key/remove", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).json(&body).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "remove_key",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/upload/start`

*/
    pub async fn start_upload<'a>(
        &'a self,
        body: &'a types::UploadStartBody,
    ) -> Result<ResponseValue<types::File>, Error<()>> {
        let url = format!("{}/upload/start", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "start_upload",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            201u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/upload/{mnemonic}/cancel`

*/
    pub async fn cancel_upload<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!(
            "{}/upload/{}/cancel", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "cancel_upload",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/upload/{mnemonic}/finish`

*/
    pub async fn finish_upload<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<types::File>, Error<()>> {
        let url = format!(
            "{}/upload/{}/finish", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "finish_upload",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/upload/unfinished`

*/
    pub async fn unfinished_uploads<'a>(
        &'a self,
    ) -> Result<ResponseValue<::std::vec::Vec<types::FileUpload>>, Error<()>> {
        let url = format!("{}/upload/unfinished", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "unfinished_uploads",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/upload/cleanup`

*/
    pub async fn cleanup_uploads<'a>(&'a self) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!("{}/upload/cleanup", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "cleanup_uploads",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/token/add`

*/
    pub async fn add_token<'a>(
        &'a self,
        body: &'a types::TokenAddBody,
    ) -> Result<ResponseValue<types::TokenResponse>, Error<()>> {
        let url = format!("{}/token/add", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "add_token",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/token/list`

*/
    pub async fn list_tokens<'a>(
        &'a self,
    ) -> Result<ResponseValue<::std::vec::Vec<types::TokenResponse>>, Error<()>> {
        let url = format!("{}/token/list", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "list_tokens",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/token/remove`

*/
    pub async fn remove_token<'a>(
        &'a self,
        body: &'a types::RemoveTokenBody,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!("{}/token/remove", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).json(&body).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "remove_token",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**List all jobs

Sends a `GET` request to `/job/list`

*/
    pub async fn list_jobs<'a>(
        &'a self,
    ) -> Result<ResponseValue<::std::vec::Vec<types::Job>>, Error<()>> {
        let url = format!("{}/job/list", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "list_jobs",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Get all the file information required to download a single file

Sends a `GET` request to `/fs/{mnemonic}/file`

*/
    pub async fn file_info<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<types::FileDownload>, Error<()>> {
        let url = format!(
            "{}/fs/{}/file", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "file_info",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Recursively list all files in a directory

Sends a `GET` request to `/fs/{mnemonic}/file/list`

*/
    pub async fn list_files<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<::std::vec::Vec<types::FileKeys>>, Error<()>> {
        let url = format!(
            "{}/fs/{}/file/list", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "list_files",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/fs/{mnemonic}/parent/list`

*/
    pub async fn list_parents<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<::std::vec::Vec<types::InodeMembers>>, Error<()>> {
        let url = format!(
            "{}/fs/{}/parent/list", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "list_parents",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/{mnemonic}/member/add`

*/
    pub async fn add_members<'a>(
        &'a self,
        mnemonic: &'a str,
        body: &'a types::MemberAddBody,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!(
            "{}/fs/{}/member/add", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).json(&body).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "add_members",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/{mnemonic}/member/set`

*/
    pub async fn set_access<'a>(
        &'a self,
        mnemonic: &'a str,
        body: &'a types::SetAccessBody,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!(
            "{}/fs/{}/member/set", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).json(&body).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "set_access",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/{mnemonic}/duplicate`

*/
    pub async fn duplicate_inode<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<types::Inode>, Error<()>> {
        let url = format!(
            "{}/fs/{}/duplicate", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "duplicate_inode",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/{mnemonic}/remove`

*/
    pub async fn remove_inode<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!(
            "{}/fs/{}/remove", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "remove_inode",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/{mnemonic}/destroy`

*/
    pub async fn destroy_inode<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!(
            "{}/fs/{}/destroy", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "destroy_inode",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/fs/{mnemonic}/tree`

*/
    pub async fn inode_tree<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<types::InodeTree>, Error<()>> {
        let url = format!(
            "{}/fs/{}/tree", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "inode_tree",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/fs/resolve/{path}`

*/
    pub async fn resolve_path<'a>(
        &'a self,
        path: &'a str,
    ) -> Result<ResponseValue<::std::option::Option<types::Inode>>, Error<()>> {
        let url = format!(
            "{}/fs/resolve/{}", self.baseurl, encode_path(& path.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "resolve_path",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/fs/resolve`

*/
    pub async fn resolve_home<'a>(
        &'a self,
    ) -> Result<ResponseValue<::std::option::Option<types::Inode>>, Error<()>> {
        let url = format!("{}/fs/resolve", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "resolve_home",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/move`

*/
    pub async fn move_inode<'a>(
        &'a self,
        body: &'a types::MoveInodeBody,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!("{}/fs/move", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).json(&body).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "move_inode",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/fs/list`

*/
    pub async fn list_home<'a>(
        &'a self,
    ) -> Result<ResponseValue<types::ListResponse>, Error<()>> {
        let url = format!("{}/fs/list", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "list_home",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/fs/{mnemonic}/list`

*/
    pub async fn list_inodes<'a>(
        &'a self,
        mnemonic: &'a str,
    ) -> Result<ResponseValue<types::ListResponse>, Error<()>> {
        let url = format!(
            "{}/fs/{}/list", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "list_inodes",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/directory/add`

*/
    pub async fn add_directory<'a>(
        &'a self,
        body: &'a types::AddDirectoryBody,
    ) -> Result<ResponseValue<types::Directory>, Error<()>> {
        let url = format!("{}/fs/directory/add", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "add_directory",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/search`

*/
    pub async fn search_fs<'a>(
        &'a self,
        body: &'a types::InodeSearchBody,
    ) -> Result<ResponseValue<types::SearchFsResponse>, Error<()>> {
        let url = format!("{}/fs/search", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "search_fs",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/search/{jobId}`

*/
    pub async fn search_results<'a>(
        &'a self,
        job_id: &'a str,
    ) -> Result<ResponseValue<types::InodeSearchResults>, Error<()>> {
        let url = format!(
            "{}/fs/search/{}", self.baseurl, encode_path(& job_id.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "search_results",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/fs/search/{jobId}/cancel`

*/
    pub async fn search_cancel<'a>(
        &'a self,
        job_id: &'a str,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!(
            "{}/fs/search/{}/cancel", self.baseurl, encode_path(& job_id.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "search_cancel",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Find all file data entries that are not referenced by any inode

Sends a `GET` request to `/filedata/orphaned`

*/
    pub async fn list_orphaned<'a>(
        &'a self,
    ) -> Result<ResponseValue<::std::vec::Vec<types::FileData>>, Error<()>> {
        let url = format!("{}/filedata/orphaned", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "list_orphaned",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/filedata/{uid}/remove`

*/
    pub async fn remove_file_data<'a>(
        &'a self,
        uid: &'a str,
    ) -> Result<ResponseValue<()>, Error<()>> {
        let url = format!(
            "{}/filedata/{}/remove", self.baseurl, encode_path(& uid.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.post(url).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "remove_file_data",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            204u16 => Ok(ResponseValue::empty(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/filedata/checkIntegrity`

*/
    pub async fn check_integrity<'a>(
        &'a self,
    ) -> Result<ResponseValue<types::IntegrityCheckResult>, Error<()>> {
        let url = format!("{}/filedata/checkIntegrity", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "check_integrity",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/download/{mnemonic}/decrypt`

*/
    pub async fn decrypt_dataset<'a>(
        &'a self,
        mnemonic: &'a str,
        body: &'a types::DecryptDatasetBody,
    ) -> Result<ResponseValue<types::TokenResponse>, Error<()>> {
        let url = format!(
            "{}/download/{}/decrypt", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "decrypt_dataset",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/download`

*/
    pub async fn download_dataset<'a>(
        &'a self,
    ) -> Result<ResponseValue<::std::string::String>, Error<()>> {
        let url = format!("{}/download", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "download_dataset",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/download/{uid}/chunk/{hash}`

*/
    pub async fn download_chunk<'a>(
        &'a self,
        uid: &'a str,
        hash: &'a str,
    ) -> Result<ResponseValue<ByteStream>, Error<()>> {
        let url = format!(
            "{}/download/{}/chunk/{}", self.baseurl, encode_path(& uid.to_string()),
            encode_path(& hash.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self.client.get(url).headers(header_map).build()?;
        let info = OperationInfo {
            operation_id: "download_chunk",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => Ok(ResponseValue::stream(response)),
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `GET` request to `/auth/info`

*/
    pub async fn auth_info<'a>(
        &'a self,
    ) -> Result<ResponseValue<types::User>, Error<()>> {
        let url = format!("{}/auth/info", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .get(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "auth_info",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/auth/signIn`

*/
    pub async fn sign_in<'a>(
        &'a self,
        body: &'a types::SignInBody,
    ) -> Result<ResponseValue<types::SignInResponse>, Error<()>> {
        let url = format!("{}/auth/signIn", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "sign_in",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/auth/verify`

*/
    pub async fn verify_email<'a>(
        &'a self,
        body: &'a types::VerifyEmailBody,
    ) -> Result<ResponseValue<::std::string::String>, Error<types::ErrorResponse>> {
        let url = format!("{}/auth/verify", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .json(&body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "verify_email",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            500u16 => {
                Err(Error::ErrorResponse(ResponseValue::from_response(response).await?))
            }
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `POST` request to `/auth/refresh`

*/
    pub async fn refresh_token<'a>(
        &'a self,
    ) -> Result<ResponseValue<::std::string::String>, Error<()>> {
        let url = format!("{}/auth/refresh", self.baseurl,);
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(1usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        #[allow(unused_mut)]
        let mut request = self
            .client
            .post(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "refresh_token",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            200u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
    /**Sends a `PUT` request to `/upload/{mnemonic}/chunk`

Arguments:
- `mnemonic`
- `content_range`: The range of bytes in the chunk
It should be in the format `bytes {start}-{end}/{size?}`
- `digest`: The SHA-256 hash of the chunk data encoded in base64url
It should be in the format `sha-256={hash}`
- `body`
*/
    pub async fn chunk_upload<'a, B: Into<reqwest::Body>>(
        &'a self,
        mnemonic: &'a str,
        content_range: &'a str,
        digest: &'a str,
        body: B,
    ) -> Result<ResponseValue<types::Chunk>, Error<()>> {
        let url = format!(
            "{}/upload/{}/chunk", self.baseurl, encode_path(& mnemonic.to_string()),
        );
        let mut header_map = ::reqwest::header::HeaderMap::with_capacity(3usize);
        header_map
            .append(
                ::reqwest::header::HeaderName::from_static("api-version"),
                ::reqwest::header::HeaderValue::from_static(Self::api_version()),
            );
        header_map.append("content-range", content_range.to_string().try_into()?);
        header_map.append("digest", digest.to_string().try_into()?);
        #[allow(unused_mut)]
        let mut request = self
            .client
            .put(url)
            .header(
                ::reqwest::header::ACCEPT,
                ::reqwest::header::HeaderValue::from_static("application/json"),
            )
            .header(
                ::reqwest::header::CONTENT_TYPE,
                ::reqwest::header::HeaderValue::from_static("application/octet-stream"),
            )
            .body(body)
            .headers(header_map)
            .build()?;
        let info = OperationInfo {
            operation_id: "chunk_upload",
        };
        self.pre(&mut request, &info).await?;
        let result = self.exec(request, &info).await;
        self.post(&result, &info).await?;
        let response = result?;
        match response.status().as_u16() {
            201u16 => ResponseValue::from_response(response).await,
            _ => Err(Error::UnexpectedResponse(response)),
        }
    }
}
/// Items consumers will typically use such as the Client.
pub mod prelude {
    #[allow(unused_imports)]
    pub use super::Client;
}
