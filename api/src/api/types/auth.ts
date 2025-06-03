export interface SignInBody {
  email: string;
}

export interface TokenRequestBody {
  sub: string;
  challenge?: string;
}

export type Scope = 'dabih:admin' | 'dabih:api' | 'dabih:upload';

export const validScopes: Scope[] = [
  'dabih:admin',
  'dabih:api',
  'dabih:upload',
];
