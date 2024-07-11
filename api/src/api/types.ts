import { Omit } from '@prisma/client/runtime/library';
import { JsonWebKey } from 'crypto';
import { type } from 'os';

/**
 * mnemonics are human readable unique identifiers for datasets
 * mnemonics have the form <random adjective>_<random first name>
 * @pattern ^[a-z_]+$
 * @example "happy_jane"
 */
export type Mnemonic = string;

/**
 * The AES-256 encryption key used to encrypt and decrypt datasets.
 * base64url encoded
 */
export type AESKey = string;

export interface FileDecryptionKey {
  mnemonic: Mnemonic;
  key: AESKey;
}

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
   * The id of the data the chunk belongs to
   */
  dataId: number;
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

export type PermissionString = 'none' | 'read' | 'write';

export interface Member {
  id: number;
  sub: string;
  inodeId: number;
  mnemonic: Mnemonic;
  permission: number;
  permissionString: PermissionString;
  createdAt: Date;
  updatedAt: Date;
}

export interface Key {
  id: number;
  inodeId: number;
  hash: string;
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

export interface FileData {
  uid: string;
  createdBy: string;
  fileName: string;
  filePath: string | null;
  hash: string | null;
  size: number | null;
  keyHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DownloadData = FileData & {
  chunks: Chunk[];
};
export interface FileNode {
  id: number;
  mnemonic: Mnemonic;
  name: string;
  tag: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
export type File = FileNode & {
  data: FileData;
};

export type FileKeys = File & {
  keys: Key[];
};

export type FileDownload = File & {
  data: DownloadData;
  keys: Key[];
};

export interface Directory {
  mnemonic: Mnemonic;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface AddDirectoryBody {
  /**
   * The name of the directory
   */
  name: string;
  /**
   * The mnemonic of the parent directory
   */
  parent?: Mnemonic;
  /**
   * A custom searchable tag for the directory
   */
  tag?: string;
}

export interface MoveInodeBody {
  /**
   * The mnemonic of the inode to move
   */
  mnemonic: Mnemonic;
  /**
   * Optional: The mnemonic of the new parent directory
   */
  parent?: Mnemonic;
  /**
   * The list of AES-256 keys required to decrypt all child datasets
   */
  keys?: FileDecryptionKey[];
  /**
   * Optional: The new name of the inode
   */
  name?: string;
  /**
   * Optional: The new tag of the inode
   */
  tag?: string;
}

export interface UploadStartBody {
  /**
   * The name of the file to upload
   */
  fileName: string;
  /**
   * The mnemonic of the directory to upload the file to
   */
  directory?: Mnemonic;
  /**
   * The original path of the file
   */
  filePath?: string;
  /**
   * The size of the file in bytes
   * @isInt
   */
  size?: number;
  /**
   * A custom searchable tag for the file
   */
  tag?: string;
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
  key: JsonWebKey;
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
type SearchDataset = Omit<Dataset, 'chunks' | 'keys'>;

export interface SearchRequestBody {
  /**
   * The search query
   */
  query?: string;
  /**
   * Search for datasets with a specific file name
   */
  fileName?: string;
  /**
   * Search for datasets with a specific custom name
   */
  name?: string;
  /**
   * Search for datasets with a specific mnemonic
   */
  mnemonic?: string;
  /**
   * Search for datasets with a specific key hash
   */
  hash?: string;
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
  sortBy?: Exclude<keyof SearchDataset, 'members'>;
  /**
   * The direction to sort the results by
   */
  sortDir?: 'asc' | 'desc';
}

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

export interface MemberAddBody {
  /**
   * The users to add to the dataset
   */
  subs: string[];
  /**
   * The list of AES-256 keys required to decrypt all child datasets
   */
  keys: FileDecryptionKey[];
}

export interface SetAccessBody {
  /**
   * The user to set the permission for
   */
  sub: string;
  /**
   * The permission to set
   */
  permission: 'read' | 'write' | 'none';
}

export interface DabihInfo {
  version: string;
  branding: {
    admin: {
      name: string;
      email: string;
    };
    contact: {
      name: string;
      email: string;
      street: string;
      zip: string;
      city: string;
      state: string;
      country: string;
      phone: string;
    };
    department: {
      name: string;
      url: string;
      logo: string;
    };
    organization: {
      name: string;
      url: string;
      logo: string;
    };
  };
}
