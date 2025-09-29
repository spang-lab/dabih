export interface AuthMetadata {
  issuer: string;
  authorization_endpoint: string;
  userinfo_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
}

export interface AuthProvider {
  id: string;
  name: string;
  authority: string;
  signInUrl?: string;
  clientId: string;
  scopes: string[];
  logo?: string;
  metadata?: AuthMetadata;
}
