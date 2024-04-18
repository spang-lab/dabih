import { BusboyHeaders } from "@fastify/busboy";
import { Prisma } from "@prisma/client";
import { JsonWebKey } from "crypto";

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

import { Request } from "koa";

export type RequestWithHeaders = Request & {
  user: User;
};



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
    * The CRC32 checksum of the encrypted chunk data base64url encoded
    */
  crc: string | null;
  /**
    * chunk creation timestamp
    */
  createdAt: Date;
  /**
    * chunk last update timestamp
    */
  updatedAt: Date;
}

export interface Member {
  id: number;
  sub: string;
  datasetId: number;
  permission: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Key {
  id: number;
  datasetId: number;
  publicKeyHash: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
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
  mnemonic: Mnemonic;
  /**
    * The name of the file the dataset was created from
    * @example "file.txt"
    */
  fileName: string;
  /**
    * The user that uploaded the dataset
    * @example "admin"
    */
  createdBy: string;
  /**
    * The hash of the AES-256 encryption key base64url encoded
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
    * The hash of the entire dataset base64url encoded
    */
  hash: string | null;
  /**
    * The size of the dataset in bytes
    * @isInt
    */
  size: number | null;
  /** 
    * The list of chunks that make up the dataset
    */
  chunks: Chunk[];
  /**
    * The list of members that have access to the dataset
    */
  members: Member[];
  /**
    * A list of encrypted keys for the dataset
    */
  keys: Key[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UploadStartBody {
  /**
    * The name of the file to upload
    */
  fileName: string;
  /**
    * The total size of the file in bytes, if known
    * @isInt
    */
  size?: number;
  /**
    * A custom name for the dataset
    */
  name?: string;
  /**
    * The original path of the file
    */
  path?: string;
  /**
    * The hash of the first 2MiB chunk of the file
    */
  chunkHash?: string;
}
export type UploadStartResponse = Omit<Dataset, "chunks" | "keys"> & {
  /**
    * The hash of the duplicate dataset or null if there is no duplicate
    */
  duplicate: string | null;
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
}

export interface UserAddBody {
  /**
    * The unique user sub
    * if undefined the sub from the auth token will be used 
    */
  sub?: string;
  /**
    * The name of the user
    */
  name: string;
  /**
    * The email of the user
    */
  email: string;
  /**
    * The public key of the user as a JWK
    */
  key: JsonWebKey
  /**
    * If true the key is a root key, used to decrypt all datasets
    */
  isRootKey?: boolean;
}

export interface KeyAddBody {
  /** 
    * The user the key should belong to
    */
  sub: string;
  /**
    * The public key as a JWK 
    */
  data: JsonWebKey;
  /**
    * If true the key is a root key, used to decrypt all datasets
    */
  isRootKey: boolean;
}

export interface KeyEnableBody {
  /**
    * The user the key belongs to
    */
  sub: string;
  /**
    * The hash of the key
    */
  hash: string;
  /**
    * The key status to set
    */
  enabled: boolean;
}

export interface KeyRemoveBody {
  /**
    * The user the key belongs to
    */
  sub: string;
  /**
    * The hash of the key
    */
  hash: string;
}


export interface UserResponse {
  /**
    * The database id of the user
    * @isInt
    */
  id: number;
  /**
    * The unique user sub
    */
  sub: string;
  /**
    * The name of the user
    */
  name: string;
  /**
    * The email of the user
    */
  email: string;
  /**
    * The date the user was created
    */
  createdAt: Date;
  /**
    * The date the user was last updated
    */
  updatedAt: Date;
  /**
    * The public keys of the user
    */
  keys: PublicKey[];
}


export interface ChunkAddBody {
  mnemonic: Mnemonic;
  hash: string;
  start: number;
  end: number;
  size?: number;
}

export interface SearchRequestBody {
  /**
    * The search query
    */
  query?: string;
  /**
    * Also show deleted datasets
    */
  showDeleted?: boolean;
  /**
    * Also show datasets the user does not have access to
    * This is ignored if the user is not an admin 
    */
  showAll?: boolean;
  /**
    * The number of datasets to skip before returning results.
    * @isInt
    */
  skip?: number;
  /**
    * The maximum number of results to return
    * @isInt
    */
  take?: number;
  /**
    * The field to sort the results by
    */
  sortBy?: keyof Dataset;
  /**
    * The direction to sort the results by
    */
  sortDir?: Prisma.SortOrder,
}

type SearchDataset = Omit<Dataset, "chunks" | "keys">;
export interface SearchResponseBody {
  /**
    * The total number of datasets that match the search query
    * @isInt
    */
  count: number;
  /**
    * The datasets that match the search query, paginated 
    */
  datasets: SearchDataset[];
}
