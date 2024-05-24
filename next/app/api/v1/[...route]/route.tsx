import { NextRequest } from 'next/server';
import path from 'path';
import { requireEnv } from '@/lib/config';
import jwt from 'jsonwebtoken';
import { User } from 'next-auth';
import { auth } from '@/lib/auth/auth';

const createJWT = (user: User) => {
  const { sub, scopes } = user;
  const secret = requireEnv('TOKEN_SECRET');
  const apiUrl = requireEnv('API_URL');

  const oneMinute = 60;
  const now = Math.floor(Date.now() / 1000);

  const token = jwt.sign({
    sub,
    scopes,
    iss: 'dabih',
    aud: apiUrl,
    exp: now + oneMinute,
  }, secret);
  return token;
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
      const token = createJWT(user);
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
