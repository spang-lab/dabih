import { Provider } from 'next-auth/providers';

import CredentialsProvider from 'next-auth/providers/credentials';

export default function DemoProvider({ enabled }): Provider {
  const provider = CredentialsProvider({
    name: 'Demo Provider',
    id: 'demo',
    credentials: {
      name: { label: 'Username', type: 'text', placeholder: 'Demo User' },
    },
    async authorize(credentials) {
      if (!credentials) {
        return null;
      }
      const { name } = credentials;
      if (!name) {
        return null;
      }
      const maxLength = 20;
      const short = name.substring(0, maxLength);

      const id = short.trim()
        .replace(/\s+/, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toLowerCase();

      return {
        id,
        sub: id,
        name: short,
        email: `${id}@dabih.com`,
        scopes: ['upload', 'dataset', 'key', 'token', 'admin'],
      };
    },
  });
  provider.options.enabled = enabled;
  return provider as Provider;
}
