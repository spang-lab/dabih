/* eslint-disable no-param-reassign, no-console */

import { Provider } from 'next-auth/providers';
import GitHubProvider from 'next-auth/providers/github';
import UniRegensburgProvider from './ur';
import SpangLabProvider from './spang-lab';
import DemoProvider from './demo';

const sessionCb = ({ session, token }) => {
  session.user.scopes = token.scopes;
  session.user.sub = token.sub;
  return session;
};

const jwt = ({ token, user }) => {
  if (user) {
    token.scopes = user.scopes;
  }
  return token;
};

const isConfigured = (provider: Provider) => {
  if (!provider || !provider.options) {
    return false;
  }
  const { options } = provider;
  if (options.enabled) {
    return options.enabled;
  }
  return !!options.clientId && !!options.clientSecret;
};

const getProviders = () => {
  const providers = [
    UniRegensburgProvider({
      enabled: process.env.UR_AUTH,
    }),
    SpangLabProvider({
      clientId: process.env.SPANGLAB_ID as string,
      clientSecret: process.env.SPANGLAB_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
  ].filter(isConfigured);
  if (providers.length === 0) {
    return [DemoProvider()];
  }
  return providers;
};

const authOptions = {
  session: {
    maxAge: 3 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: getProviders(),
  callbacks: {
    session: sessionCb,
    jwt,
  },
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
};
export default authOptions;
