import { OpenIDProvider } from 'src/api/types/auth';

const providers: OpenIDProvider[] = [
  {
    id: 'github',
    name: 'GitHub',
    logo_uri: '/images/providers/github.png',

    issuer: 'https://github.com/',
    discovery: false,
    authorization_endpoint: 'https://github.com/login/oauth/authorize',
    token_endpoint: 'https://github.com/login/oauth/access_token',
    userinfo_endpoint: 'https://api.github.com/user',
    jwks_uri: 'https://github.com/login/oauth/.well-known/jwks',
    subject_types_supported: ['public'],
    response_types_supported: ['code', 'id_token'],
    claims_supported: ['sub', 'aud', 'exp', 'nbf', 'iat', 'iss', 'act'],
    id_token_signing_alg_values_supported: ['RS256'],
    scopes_supported: ['openid'],
    code_challenge_methods_supported: ['S256'],
  },
];

export default providers;
