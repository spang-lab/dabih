import { Request } from 'koa';
import type { User } from './api/types';
import { isToken, convertToken } from './lib/database/token';
import db from './lib/db';

import { AuthenticationError } from './api/errors';
import { getSecrets, SECRET } from '#lib/redis/secrets';
import crypto from './lib/crypto';

export const parseRequest = (request: Request): string => {
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

const verify = async (
  request: Request,
): Promise<{
  scopes: string[];
  sub: string;
}> => {
  const tokenStr = parseRequest(request);
  if (isToken(tokenStr)) {
    // This is a token in the database, not a JWT
    const result = await db.token.findUnique({
      where: {
        value: tokenStr,
      },
    });
    if (!result) {
      throw new AuthenticationError(`Token not found: ${tokenStr}`);
    }
    const token = convertToken(result, false);
    if (token.expired) {
      throw new AuthenticationError(`Token expired ${token.expired}`);
    }
    return token;
  }
  const secrets = await getSecrets(SECRET.AUTH);
  const decoded = crypto.jwt.verifyWithSecrets(tokenStr, secrets);
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
  const scopes = scope.split(/\s+/);
  return {
    sub,
    scopes,
  };
};

export async function koaAuthentication(
  request: Request,
  _name: string,
  scopes?: string[],
): Promise<User> {
  const decoded = await verify(request);
  const missing = scopes?.filter((scope) => !decoded.scopes.includes(scope));
  if (missing?.length) {
    throw new AuthenticationError(
      `JWT does not contain the required scope: ${missing.join(', ')}`,
    );
  }
  const user = {
    ...decoded,
    isAdmin: decoded.scopes.includes('dabih:admin'),
  };
  return user;
}
