import NextAuth from "next-auth"

import { Provider } from 'next-auth/providers';
import DemoProvider from "./demo";
import SpangLabProvider from './spang-lab';
import UniRegensburgProvider from './ur';
import GitHubProvider from 'next-auth/providers/github';

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
      clientId: process.env.SPANGLAB_ID!,
      clientSecret: process.env.SPANGLAB_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ].filter(isConfigured);
  if (providers.length === 0) {
    return [DemoProvider()];
  }
  return providers;
};


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: getProviders(),
});

