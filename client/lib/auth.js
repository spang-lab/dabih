import GitHubProvider from 'next-auth/providers/github';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GoogleProvider from 'next-auth/providers/google';

export function SpangLabProvider(options) {
  const { clientId, clientSecret } = options;
  if (!clientId || !clientSecret) {
    return null;
  }

  const provider = {
    clientId,
    clientSecret,
    id: 'acrux',
    name: 'Spang Lab Acrux',
    type: 'oauth',
    wellKnown: 'https://auth.spang-lab.de/oidc/.well-known/openid-configuration',
    endSession: 'https://auth.spang-lab.de/oidc/session/end',
    authorization: {
      params: {
        scope: 'openid profile grouplist',
      },
    },
    idToken: true,
    checks: ['pkce', 'state'],
    style: {
      logo: 'images/spang-lab-logo-32.png',
      logoDark: 'images/spang-lab-logo-32.png',
      bg: '#fff',
      bgDark: '#000',
      text: '#000',
      textDark: '#fff',
    },
    options,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        image: '',
      };
    },
  };
  return provider;
}

export function getProviders() {
  const providers = [
    SpangLabProvider({
      clientId: process.env.SPANGLAB_ID,
      clientSecret: process.env.SPANGLAB_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ];
  return providers.filter((p) => p);
}
