import GitHubProvider from 'next-auth/providers/github';
import AzureADProvider from 'next-auth/providers/azure-ad';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import ldap from 'ldapjs';

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

export function LdapProvider(options) {
  const client = ldap.createClient({
    url: process.env.LDAP_URI,
  })
  const provider = CredentialsProvider({
    name: "LDAP", 
    credentials: {
        username: { label: "DN", type: "text", placeholder: "" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        return new Promise((resolve, reject) => {
          client.bind(credentials.username, credentials.password, (error) => {
            if (error) {
              console.error("Failed")
              reject()
            } else {
              console.log("Logged in")
              resolve({
                username: credentials.username,
                password: credentials.password,
              })
            }
          })
        })

  })
  return provider
}




const isConfigured = (provider) => {
  if (!provider || !provider.options) {
    return false;
  }
  const { options } = provider;
  return Object.keys(options).every((key) => options[key]);
};

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
  return providers.filter((p) => isConfigured(p));
}
