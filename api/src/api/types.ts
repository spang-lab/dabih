
/**
  * mnemonics are human readable unique identifiers for datasets
  * mnemonics have the form <random adjective>_<random first name>
  * @pattern ^[a-z]+_[a-z]+$
  * @example "happy_jane"
  */
export type Mnemonic = string;

export interface User {
  sub: string;
  scopes: string[];
  isAdmin: boolean;
}


export interface RequestWithUser {
  user: User;
}


export interface Chunk {
  /**
    * The database id of the chunk
    * @isInt
    */
  id: number;
  /**
    * The SHA-256 hash of the unencrypted chunk data base64url encoded
    */
  hash: string;
  /**
    * The AES-256 initialization vector base64url encoded
    */
  iv: string;
  /**
    * The start of the chunk as a byte position in the file
    * @isInt
    */
  start: number;
  /**
    * The end of the chunk as a byte position in the file
    * @isInt
    */
  end: number;
  /**
    * The size of the whole file in bytes
    * @isInt
    */
  size: number;
  /**
    * The CRC32 checksum of the encrypted chunk data base64url encoded
    */
  crc: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

/**
  * A dataset is a file uploaded to dabih.
  * It is a collection of chunks that are encrypted with the same keyHash
  */

export interface Dataset {
  /**
    * The database id of the dataset
    * @isInt
    */
  id: number;
  /**
    * The mnemonic of the dataset
    */
  mnemonic: Mnemonic;
  /**
    * The name of the file the dataset was created from
    */
  fileName: string;
  /**
    * The user that uploaded the dataset
    */
  createdBy: string;
  /**
    * The hash of the AES-256 encryption key
    */
  keyHash: string;
  /**
    * A custom non unique name of the dataset
    */
  name: string | null;
  /**
    * The original path of the dataset
    */
  path: string | null;
  /**
    * The hash of the entire dataset
    */
  hash: string | null;
  /**
    * The size of the dataset in bytes
    * @isInt
    */
  size: number | null;
  chunks?: Chunk[];
}

export type UploadStartBody = Pick<Dataset, "fileName" | "size" | "name" | "path"> & {
  /**
    * The hash of the first 2MiB chunk of the file
    */
  chunkHash: string;
}
export type UploadStartResponse = Omit<Dataset, "chunks"> & {
  /**
    * The hash of the duplicate dataset or null if there is no duplicate
    */
  duplicate?: string;
}


export interface Token {
  id: number;
  value: string;
  sub: string;
  scope: string;
  exp: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenAddBody {
  /**
    * The array of scopes the token should have
    */
  scopes: string[];
  /**
    * The time in seconds the token should be valid for
    * If null the token will never expire 
    * @isInt
    */
  lifetime: number | null;
}

export type TokenResponse = Token & {
  /**
    * The array of scopes the token has
    */
  scopes: string[];
  /**
    * false if the token has not expired,
    * otherwise a string describing how long ago the token expired
    */
  expired: string | false;
};

export interface PublicKey {
  id: number;
  userId: number;
  hash: string;
  data: string;
  isRootKey: boolean;
  enabled: Date | null;
  enabledBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type KeyAddBody = Pick<PublicKey, "data" | "isRootKey">;


