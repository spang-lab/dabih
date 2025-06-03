export interface SignInBody {
  email: string;
}

export interface TokenRequestBody {
  sub: string;
  challenge?: string;
}
