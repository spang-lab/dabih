import { Provider } from 'next-auth/providers';

import CredentialsProvider from 'next-auth/providers/credentials';

export default function DemoProvider({ enabled }): Provider {
  const provider = CredentialsProvider({
    name: 'Demo Provider',
    id: 'demo',
    credentials: {
      token: { label: 'Token', type: 'password' },
    },
    async authorize(credentials, _req) {
      if (!credentials) {
        return null;
      }
      const { token } = credentials;
      if (!token || !token.length) {
        return null;
      }
      return {
        id: 'root',
        access_token: token,
      };
    },
  });
  provider.options.enabled = enabled;
  return provider as Provider;
}
