import NextAuth from "next-auth";

import DemoProvider from "./demo";

declare module "next-auth" {
  interface User {
    sub: string;
    scopes: string[];
    isAdmin: boolean;
  }

  interface Session {
    user: {
      name: string;
      email: string;
      sub: string;
      scopes: string[];
      isAdmin: boolean;
    };
  }
}

declare module "@auth/core/JWT" {
  interface JWT {
    sub: string;
    scopes: string[];
  }
}

const providers = [DemoProvider()];

export interface Provider {
  id: string;
  name: string;
}

export const providerMap: Provider[] = providers.map((provider) => {
  const id = provider.options?.id;
  if (typeof id !== "string") {
    throw new Error(`Provider ${provider.name} does not have an id`);
  }
  return { id, name: provider.name };
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.scopes = user.scopes ?? [];
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.scopes = token.scopes;
      session.user.sub = token.sub;
      session.user.isAdmin = token.scopes.includes("dabih:admin");
      return session;
    },
  },
});
