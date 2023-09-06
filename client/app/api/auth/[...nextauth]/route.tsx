// @ts-nocheck
import NextAuth from 'next-auth';
import authOptions from '../options';

console.log(authOptions);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
