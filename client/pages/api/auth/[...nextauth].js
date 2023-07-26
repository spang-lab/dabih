/* eslint-disable no-param-reassign */
import axios from 'axios';
import NextAuth from 'next-auth';
import { getProviders } from '../../../lib';

const apiUser = async (provider, accessToken) => {
  const url = `${process.env.NEXTAUTH_URL}/api/v1/token`;
  const result = await axios.post(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${provider}_${accessToken}`,
      },
    },
  );
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
    } catch (err) {
      const message = err.response.data || err.message;
      token.error = message;
    }
  }

  return token;
};
const sessionCb = async ({ session, token }) => {
  if (token.error) {
    return { error: token.error };
  }
  // Send properties to the client, like an access_token and user id from a provider.
  session.accessToken = token.accessToken;
  session.provider = token.provider;
  session.user = token.user;
  return session;
};

const authHandler = NextAuth({
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
    error: '/auth/error',
  },
});
export default async function handler(...params) {
  await authHandler(...params);
}
