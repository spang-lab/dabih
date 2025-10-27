import { OpenIDProvider } from 'src/api/types/auth';

const providers: OpenIDProvider[] = [
  {
    url: 'https://github.com',
    id: 'github',
    name: 'GitHub',
    logo_uri: '/images/providers/github.png',
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
  {
    url: 'https://login.microsoftonline.com',
    id: 'microsoft',
    name: 'Microsoft',
    logo_uri: '/images/providers/microsoft.png',
    discovery: true,
    supportsPKCE: true,
  },
];

export const initProvider = (providerUrl: string) => {
  const provider = providers.find((p) => providerUrl.startsWith(p.url));
  if (provider) {
    return provider;
  }

  return {
    url: providerUrl,
    id: 'custom',
    name: 'Custom Provider',
    logo_uri: '/images/providers/default.png',
    discovery: true,
  };
};

export const convertUserInfo = (
  providerId: string,
  userInfo: Record<string, unknown>,
) => {
  console.log('User Info:', userInfo);
  switch (providerId) {
    case 'github': {
      const sub = (userInfo.id as number).toString();
      return {
        sub: `github:${sub}`,
        email: userInfo.email as string,
      };
    }
    default: {
      const { sub, email } = userInfo;
      if (!sub || !email) {
        throw new Error(
          `userInfo is missing required fields (sub, email): ${JSON.stringify(userInfo)}`,
        );
      }
      return {
        sub: `custom:${sub as string}`,
        email: email as string,
      };
    }
  }
};
