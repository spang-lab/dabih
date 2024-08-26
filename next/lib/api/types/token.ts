export interface Token {
  /**
   * The id of the token
   * @format bigint
   */
  id: unknown;
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
