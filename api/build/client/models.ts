

/**
 * From T, pick a set of properties whose keys are in the union K
 */
export type Pick_Dataset_Exclude_keyofDataset_chunks__ = {
        /**
 * The database id of the dataset
 */
id: number
/**
 * The mnemonic of the dataset
 */
mnemonic: string
/**
 * The name of the file the dataset was created from
 */
fileName: string
/**
 * The user that uploaded the dataset
 */
createdBy: string
/**
 * The hash of the AES-256 encryption key
 */
keyHash: string
/**
 * A custom non unique name of the dataset
 */
name: string
/**
 * The original path of the dataset
 */
path: string
/**
 * The hash of the entire dataset
 */
hash: string
/**
 * The size of the dataset in bytes
 */
size: number
    };

/**
 * Construct a type with the properties of T except for those in type K.
 */
export type Omit_Dataset_chunks_ = Pick_Dataset_Exclude_keyofDataset_chunks__;

export type UploadStartResponse = (Omit_Dataset_chunks_ & {
        /**
 * The hash of the duplicate dataset or null if there is no duplicate
 */
duplicate?: string
    });

/**
 * From T, pick a set of properties whose keys are in the union K
 */
export type Pick_Dataset_fileName_or_size_or_name_or_path_ = {
        /**
 * The name of the file the dataset was created from
 */
fileName: string
/**
 * A custom non unique name of the dataset
 */
name: string
/**
 * The original path of the dataset
 */
path: string
/**
 * The size of the dataset in bytes
 */
size: number
    };

export type UploadStartBody = (Pick_Dataset_fileName_or_size_or_name_or_path_ & {
        /**
 * The hash of the first 2MiB chunk of the file
 */
chunkHash: string
    });

export type User = {
        sub: string
scopes: Array<string>
isAdmin: boolean
    };

export type Token = {
        id: number
value: string
sub: string
scope: string
exp: string | null
createdAt: string
updatedAt: string
    };

export type TokenResponse = (Token & {
        /**
 * false if the token has not expired,
 * otherwise a string describing how long ago the token expired
 */
expired: string | boolean
/**
 * The array of scopes the token has
 */
scopes: Array<string>
    });

export type TokenAddBody = {
        /**
 * The array of scopes the token should have
 */
scopes: Array<string>
/**
 * The time in seconds the token should be valid for
 * If null the token will never expire
 */
lifetime: number | null
    };