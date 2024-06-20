import { NextRequest } from 'next/server';
import path from 'path';
import { requireEnv } from '@/lib/config';
import { auth } from '@/lib/auth/auth';
import { SignJWT } from 'jose';
import { User } from 'next-auth';

export const signJWT = async (user: User) => {
  const { sub, scopes } = user;
  const host = requireEnv('API_URL');
  const tokenSecret = requireEnv("TOKEN_SECRET");

  const payload = {
    sub,
    scope: scopes.join(' '),
  };
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('dabih')
    .setExpirationTime('1m')
    .setAudience(host)
    .sign(new TextEncoder().encode(tokenSecret));
};

const handler = async (request: NextRequest, { params }: { params: { route: string } }) => {
  const baseUrl = requireEnv('API_URL');
  const url = path.join(baseUrl, 'api', 'v1', ...params.route);

  const { headers, method, body } = request;
  const existingToken = headers.get('Authorization');
  if (!existingToken) {
    const session = await auth();
    if (session) {
      const { user } = session;
      const token = await signJWT(user);
      headers.append('Authorization', `Bearer ${token}`);
    }
  }
  const result = await fetch(url, {
    method,
    body,
    headers,
    // @ts-expect-error - types are wrong
    duplex: 'half',
  });
  return result;
};

export { handler as GET, handler as POST, handler as PUT };
