export interface SignInBody {
  email: string;
}

export interface AuthToken {
  token: string;
}

export interface TokenRequestBody {
  sub: string;
  challenge?: string;
}
