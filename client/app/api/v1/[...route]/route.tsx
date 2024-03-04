import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import path from 'path';
import { requireEnv } from '@/lib/config';
import jwt from 'jsonwebtoken';
import authOptions from '../../auth/options';

const createJWT = async (session: any) => {
  const { sub, scopes } = session;
  const secret = requireEnv('TOKEN_SECRET');

  const token = jwt.sign({
    sub,
    scopes,
    iss: 'dabih',
    aud: 'dabih',
  }, secret);
  return token;
};

const handler = async (request: NextRequest, { params }) => {
  const baseUrl = requireEnv('API_URL');
  const url = path.join(baseUrl, 'api', 'v1', ...params.route);

  const session = await getServerSession(authOptions);

  const { headers, method, body } = request;

  if (session) {
    const token = await createJWT(session);
    headers.append('Authorization', `Bearer ${token}`);
  }
  const result = await fetch(url, {
    method,
    body,
    headers,
    duplex: 'half',
  });
  return result;
};

export { handler as GET, handler as POST, handler as PUT };
