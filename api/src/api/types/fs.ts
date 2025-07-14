import { Mnemonic } from './base';

/**
 * The AES-256 encryption key used to encrypt and decrypt datasets.
 * base64url encoded
 */
export type AESKey = string;

export interface FileDecryptionKey {
  mnemonic: Mnemonic;
  key: AESKey;
}

export interface Chunk {
  /**
   * The database id of the chunk
   * @format bigint
   */
  id: unknown;
  /**
   * The id of the data the chunk belongs to
   * @format bigint
   */
  dataId: unknown;
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
   * @format bigint
   */
  start: unknown;
  /**
   * The end of the chunk as a byte position in the file
   * @format bigint
   */
  end: unknown;
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

export interface FileData {
  /**
   * The database id of the file data
   * @format bigint
   */
  id: unknown;
  uid: string;
  createdBy: string;
  fileName: string;
  filePath: string | null;
  hash: string | null;
  /**
   * The size of the file in bytes
   * @format bigint
   */
  size: unknown;
  keyHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ChunkData = FileData & {
  chunks: Chunk[];
};

export interface Inode {
  /**
   * The database id of the inode
   * @format bigint
   */
  id: unknown;
  mnemonic: string;
  type: number;
  name: string;
  tag: string | null;
  data?: FileData | null;
  parentId: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export type InodeMembers = Inode & {
  members: Member[];
};
export type InodeMembersParent = InodeMembers & {
  parent: InodeMembersParent | null;
};

export type InodeTree = InodeMembersParent & {
  children?: InodeTree[];
  keys: Key[];
};

export type File = Inode & {
  data: FileData;
};

export type FileKeys = File & {
  keys: Key[];
};

export type FileUpload = File & {
  data: ChunkData;
};

export type FileDownload = File & {
  data: ChunkData;
  keys: Key[];
};

export interface Directory {
  mnemonic: Mnemonic;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Key {
  /**
   * The database id of the key
   * @format bigint
   */
  id: unknown;
  /**
   * The inode id the key belongs to
   * @format bigint
   */
  inodeId: unknown;
  hash: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  /**
   * The database id of the member
   * @format bigint
   */
  id: unknown;
  sub: string;
  /**
   * The database id of the inode
   * @format bigint
   */
  inodeId: unknown;
  permission: number;
  createdAt: Date;
  updatedAt: Date;
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
  parent?: Mnemonic | null;
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
  permission: number;
}

export interface ListResponse {
  /**
   * The list of parent directories
   */
  parents: InodeMembers[];
  /**
   * The list of inodes in the directory
   */
  children: InodeMembers[];
}

export interface InodeSearchBody {
  query: string;
}
export interface InodeSearchResults {
  isComplete: boolean;
  /**
   * The list of inodes that match the search query
   */
  inodes: Inode[];
}
