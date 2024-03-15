import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      scopes: string[],
      sub: string,
      name: string,
      email: string,
    }
  }
}
