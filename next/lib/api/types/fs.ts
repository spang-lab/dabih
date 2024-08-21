import { type } from 'os';
import { Mnemonic, PermissionString, InodeType } from './base';

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

export interface FileData {
  id: number;
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

export type ChunkData = FileData & {
  chunks: Chunk[];
};

export interface Inode {
  id: number;
  mnemonic: string;
  type: InodeType;
  name: string;
  tag: string | null;
  data: FileData | null;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InodeMembers = Inode & {
  members: Member[];
};

export type InodeTree = InodeMembers & {
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
  id: number;
  inodeId: number;
  hash: string;
  key: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Member {
  id: number;
  sub: string;
  inodeId: number;
  permission: number;
  createdAt: Date;
  updatedAt: Date;
}
export type ApiMember = Member & {
  mnemonic: Mnemonic;
  permissionString: PermissionString;
};

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
