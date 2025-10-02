export interface FileDecryptionKey {
  mnemonic: string;
  /**
   * The AES-256 encryption key used to encrypt and decrypt datasets.
   * base64url encoded
   */
  key: string;
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
  /**
   * The unique identifier of the file data
   */
  uid: string;
  /**
   * The user sub who created the file data
   */
  createdBy: string;
  /**
   * The original name of the file
   */
  fileName: string;
  /**
   * The original path of the file
   */
  filePath: string | null;
  /**
   * The hash of the unencrypted chunked file data
   */
  hash: string | null;
  /**
   * The size of the file in bytes
   * @format bigint
   */
  size: unknown;
  /**
   * The hash of the AES encryption key used to encrypt the file data
   * base64url encoded
   */
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
  /**
   * The type of the inode
   * @isInt
   * @minimum 0
   */
  type: number;
  /**
   * The name of the inode
   * this is the file/directory name
   */
  name: string;
  /**
   * A custom searchable tag for the inode
   */
  tag: string | null;
  /**
   * The database id file data if the inode is a file
   * @format bigint
   */
  /* eslint @typescript-eslint/no-redundant-type-constituents: off */
  dataId: unknown | null;
  /**
   * The file data if the inode is a file
   */
  data?: FileData | null;
  /**
   * The parent inode
   * each inode should have exactly one parent except the root inode
   */
  parentId: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export type InodeMembers = Inode & {
  /**
   * The list members of the inode
   */
  members: Member[];
};
export type InodeMembersKeys = InodeMembers & {
  /**
   * The list of encrypted AES keys for all members of the inode
   * each member has at least one key encrypted with their public key
   */
  keys: Key[];
};

export type InodeTree = InodeMembers & {
  /**
   * The list of child inodes if the inode is a directory
   */
  children?: InodeTree[];
  /**
   * The list of encrypted AES keys for all members of the inode
   * each member has at least one key encrypted with their public key
   */
  keys: Key[];
};

// Utility type to return when an inode is a known file
export type File = Inode & {
  /**
   * The file data of the inode
   */
  data: FileData;
};

export type FileKeys = File & {
  /**
   * The list of encrypted AES keys for all members of the inode
   * each member has at least one key encrypted with their public key
   */
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
  mnemonic: string;
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
  /**
   * The base64url encoded SHA-256 hash of the user's public key
   */
  hash: string;
  /**
   * The encrypted AES-256 key base64url encoded
   */
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
  /**
   * The sub claim of the user
   * This is based on the OIDC standard
   */
  sub: string;
  /**
   * The database id of the inode
   * @format bigint
   */
  inodeId: unknown;
  /**
   * The permission of the member
   * 0: no access
   * 1: read access
   * 2: write access
   * @isInt
   * @minimum 0
   */
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
  parent?: string;
  /**
   * A custom searchable tag for the directory
   */
  tag?: string;
}

export interface MoveInodeBody {
  /**
   * The mnemonic of the inode to move
   */
  mnemonic: string;
  /**
   * Optional: The mnemonic of the new parent directory
   */
  parent?: string | null;
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
   * @isInt
   * @minimum 0
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

export interface IntegrityCheckResult {
  /**
   * list of file data uids that are not referenced by a corresponding bucket
   * THIS LIST SHOULD BE EMPTY if not it indicates a serious issue
   */
  missing: string[];
  /**
   * list of buckets that do not have corresponding filedata in the database
   * this list should be empty, if not these files are orphaned and can be removed
   */
  unknown: string[];
}
