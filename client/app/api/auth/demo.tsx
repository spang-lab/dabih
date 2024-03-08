import { requireEnv } from '@/lib/config';
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
      const realToken = requireEnv('DEMO');

      if (!token || !token.length) {
        return null;
      }
      if (token !== realToken) {
        return null;
      }
      return {
        id: 'root',
        sub: 'root',
        name: 'Root',
        email: 'root@dabih.com',
        scopes: ['upload', 'dataset', 'key', 'token', 'admin'],
      };
    },
  });
  provider.options.enabled = enabled;
  return provider as Provider;
}
