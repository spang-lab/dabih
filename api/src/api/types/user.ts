import { JsonWebKey } from 'crypto';

export interface PublicKey {
  /**
   * The database id of the public key
   * @format bigint
   */
  id: unknown;
  /**
   * The user id the key belongs to
   * @format bigint
   */
  userId: unknown;
  hash: string;
  data: string;
  isRootKey: boolean;
  enabled: Date | null;
  enabledBy: string | null;
  createdAt: Date;
  updatedAt: Date;
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

export interface UserSub {
  sub: string;
}

export interface UserAddBody {
  /**
   * The unique user sub
   * if undefined the sub from the auth token will be used
   */
  sub?: string;
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

export interface UserResponse {
  /**
   * The database id of the user
   * @format bigint
   */
  id: unknown;
  /**
   * The unique user sub
   */
  sub: string;
  /**
   * The email of the user
   */
  email: string;
  /**
   * the list of scopes the user has
   */
  scope: string;
  /**
   * The time of the last authentication
   */
  lastAuthAt: Date;
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
