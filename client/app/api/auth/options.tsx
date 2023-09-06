/* eslint-disable no-param-reassign */
import axios from 'axios';

import { Provider } from 'next-auth/providers';
import GitHubProvider from 'next-auth/providers/github';
import UniRegensburgProvider from './ur';
import SpangLabProvider from './spang-lab';

const apiUser = async (provider: any, accessToken: String) => {
  const url = `${process.env.NEXTAUTH_URL}/api/v1/token`;
  const result = await axios.post(url, {}, {
    headers: {
      Authorization: `Bearer ${provider}_${accessToken}`,
    },
  });
  return result.data;
};

const jwt = async ({ token, account, user }) => {
  if (account) {
    token.provider = account.provider;
    token.accessToken = account.access_token;
    if (user && !token.accessToken) {
      token.accessToken = user.access_token;
    }
    try {
      token.user = await apiUser(token.provider, token.accessToken);
    } catch (err: any) {
      const message = err?.response?.data || err?.message;
      token.error = message;
    }
  }

  return token;
};
const sessionCb = async ({ session, token }) => {
  if (token.error) {
    return { error: token.error };
  }
  session.accessToken = token.accessToken;
  session.provider = token.provider;
  session.user = token.user;
  return session;
};

const getProviders = () => {
  const providers: Provider[] = [];
  if (process.env.UR_AUTH) {
    providers.push(UniRegensburgProvider());
  }
  if (process.env.SPANGLAB_ID && process.env.SPANGLAB_SECRET) {
    providers.push(
      SpangLabProvider({
        clientId: process.env.SPANGLAB_ID,
        clientSecret: process.env.SPANGLAB_SECRET,
      }),
    );
  }
  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    providers.push(
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    );
  }
  return providers;
};

const authOptions = {
  session: {
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: getProviders(),
  callbacks: {
    jwt,
    session: sessionCb,
  },
  pages: {
    signIn: '/account',
    error: '/auth/error',
  },
};
export default authOptions;
