/* eslint-disable no-param-reassign */
import axios from 'axios';
import NextAuth from 'next-auth';
import { getProviders } from '../../../lib';

const apiUser = async (provider, accessToken) => {
  const url = `${process.env.NEXTAUTH_URL}/api/v1/token`;
  const result = await axios.post(url, {}, {
    headers: {
      Authorization: `Bearer ${provider}_${accessToken}`,
    },
  });
  return result.data;
};

const jwt = async ({ token, account }) => {
  if (account) {
    token.provider = account.provider;
    token.accessToken = account.access_token;
    token.user = await apiUser(account.provider, account.access_token);
  }

  return token;
};
const sessionCb = async ({ session, token }) => {
  // Send properties to the client, like an access_token and user id from a provider.
  session.accessToken = token.accessToken;
  session.provider = token.provider;
  session.user = token.user;
  return session;
};

export default NextAuth({
  session: {
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: getProviders(),
  callbacks: {
    jwt,
    session: sessionCb,
  },
});
