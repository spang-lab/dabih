/**
 * The Permission type is used to represent the permissions a user has on a Inode.
 * NONE: No permissions
 * READ: user may only read the file or directory
 * WRITE: user can read, share, edit, and delete the file or directory
 */
export const Permission = {
  NONE: 0,
  READ: 1,
  WRITE: 2,
} as const;

/**
 * The Scope type is used to represent the scopes a user can have.
 * BASE: basic access to the system, can be used to sign in
 * API: access to the API, required to use any API endpoints
 * ADMIN: admin access, required to manage users and keys
 */
export const Scope = {
  BASE: 'dabih:base',
  API: 'dabih:api',
  ADMIN: 'dabih:admin',
} as const;

export interface ErrorResponse {
  message: string;
}

/**
 * PermissionString is a string representation of the Permission enum.
 */
export type PermissionString = 'none' | 'read' | 'write';

/**
 * InodeType is used to represent the type of an Inode.
 * FILE: a file
 * DIRECTORY: a directory
 * UPLOAD: a file that is being uploaded
 * TRASH: the special directory that holds deleted files
 * ROOT: the global root directory
 * HOME: the user's home directory
 * USERS: the directory that holds all user directories
 */
export const InodeType = {
  FILE: 0,
  DIRECTORY: 1,
  UPLOAD: 2,
  TRASH: 10,
  ROOT: 11,
  HOME: 12,
} as const;

/**
 * User is the type that represents a user in the system.
 */
export interface User {
  /**
   * The subject of the user, a unique identifier
   * @example "mhuttner"
   */
  sub: string;
  /**
   * The scopes the user has
   * @example ["dabih:api"]
   */
  scopes: string[];
  /**
   * Does the user have the dabih:admin scope
   */
  isAdmin: boolean;
}

/**
 * The koa request object with a user property
 */
export interface RequestWithUser {
  user: User;
}

export interface SignInResponse {
  status: 'success' | 'email_sent' | 'error';
  token?: string;
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
