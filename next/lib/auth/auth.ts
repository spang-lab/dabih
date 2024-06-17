import NextAuth, { type DefaultSession } from "next-auth";

import DemoProvider from "./demo";
import initApi from './api';


declare module "next-auth" {
  interface User {
    sub: string,
    scopes: string[]
  }

  interface Session {
    user: {
      sub: string,
      scopes: string[]
    } & DefaultSession['user']
  }
}

declare module "@auth/core/JWT" {
  interface JWT {
    sub: string,
    scopes: string[]
  }
}



const providers = [DemoProvider()];

export interface Provider {
  id: string
  name: string
}

export const providerMap: Provider[] = providers.map((provider) => {
  const id = provider.options?.id
  if (typeof id !== 'string') {
    throw new Error(`Provider ${provider.name} does not have an id`)
  }
  return { id, name: provider.name }
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    jwt: ({ token, user }) => {
      console.log(token, user);
      if (user) {
        token.scopes = user.scopes ?? [];
      }
      return token;
    },
    session: async ({ session, token }) => {
      const api = initApi(token);
      const { data: userinfo } = await api.user.me();
      console.log("userinfo", userinfo);

      session.user.scopes = token.scopes;
      session.user.sub = token.sub;
      return session;
    }
  }
});

