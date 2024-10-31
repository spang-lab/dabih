import jwt from 'jsonwebtoken';
import { requireEnv } from '#lib/env';
import { Request } from 'koa';
import { User } from './api/types';
import { isToken, convertToken } from './lib/database/token';
import db from './lib/db';

import { AuthenticationError } from './api/errors';

const parseHeader = (request: Request): string => {
  const authHeader = request.get('Authorization');
  if (!authHeader) {
    throw new AuthenticationError('No Authorization header');
  }
  const [bearer, value] = authHeader.split(' ');
  if (bearer.toLowerCase() === 'bearer' && value) {
    return value;
  }
  throw new AuthenticationError(
    'Invalid Authorization header, needs to be "Bearer <token>"',
  );
};

type AuthType = 'jwt' | 'api_key';

const verifyToken = async (request: Request, type: AuthType): Promise<User> => {
  const tokenStr = parseHeader(request);
  if (type === 'api_key') {
    if (!isToken(tokenStr)) {
      throw new AuthenticationError(
        'Expected an api key in the form dabih_at_<value>',
      );
    }
    const result = await db.token.findUnique({
      where: {
        value: tokenStr,
      },
    });
    if (!result) {
      throw new AuthenticationError('Invalid api token');
    }
    const token = convertToken(result, false);
    if (token.expired) {
      throw new AuthenticationError(`Token has expired ${token.expired}`);
    }
    const { scopes, sub } = token;
    const isAdmin = scopes.includes('dabih:admin');
    return {
      sub,
      scopes,
      isAdmin,
    };
  }

  const { origin } = request;
  const secret = requireEnv('TOKEN_SECRET');
  const decoded = jwt.verify(tokenStr, secret, {
    audience: origin,
  });
  if (typeof decoded === 'string') {
    throw new AuthenticationError('Invalid jwt');
  }
  if (!decoded.sub) {
    throw new AuthenticationError('No "sub" key in jwt');
  }
  if (!decoded.scope) {
    throw new AuthenticationError('No "scope" key in jwt');
  }
  const { scope, sub } = decoded;
  if (typeof scope !== 'string') {
    throw new AuthenticationError(
      `Invalid "scope" key in jwt: ${scope}, must be a string with space separated values`,
    );
  }
  const scopes = scope.split(' ');
  const isAdmin = scopes.includes('dabih:admin');
  return {
    sub,
    scopes,
    isAdmin,
  };
};

export async function koaAuthentication(
  request: Request,
  name: string,
  scopes?: string[],
): Promise<User> {
  if (name === 'jwt' || name === 'api_key') {
    const decoded = await verifyToken(request, name);
    const missing = scopes?.filter((scope) => !decoded.scopes.includes(scope));
    if (missing?.length) {
      throw new AuthenticationError(
        `JWT does not contain the required scope: ${missing.join(', ')}`,
      );
    }
    return decoded;
  }
  throw new AuthenticationError(`Unknown authentication method: ${name}`);
}
