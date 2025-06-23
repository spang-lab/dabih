import jwt from 'jsonwebtoken';
import { requireEnv } from '#lib/env';
import { Request } from 'koa';
import { User } from './api/types';
import { isToken, convertToken } from './lib/database/token';
import db from './lib/db';
import crypto from '#crypto';

import { AuthenticationError } from './api/errors';

const parseRequest = (request: Request): string => {
  const authCookie = request.ctx.cookies.get('auth_token');
  if (authCookie) {
    return authCookie;
  }
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
  const payload = jwt.decode(tokenStr);
  if (!payload || typeof payload !== 'object') {
    throw new AuthenticationError('Invalid token: not a valid JWT');
  }

  if (payload.email) {
    // This is a signIn Token
    const { email } = payload;
    if (typeof email !== 'string') {
      throw new AuthenticationError('Invalid token: email is not a string');
    }
    const user = await db.user.findUnique({
      where: { email },
      include: {
        keys: {
          where: {
            enabled: { not: null },
          },
        },
      },
    });
    if (!user) {
      throw new AuthenticationError(`User not found: ${email}`);
    }
    const isValid = user.keys.some((key) => {
      const publicKey = crypto.publicKey.fromString(key.data);
      try {
        jwt.verify(tokenStr, publicKey, {
          algorithms: ['RS256'],
        });
        return true;
      } catch {
        return false;
      }
    });
    if (isValid) {
      return {
        sub: user.sub,
        scopes: ['dabih:token'],
      };
    }
    throw new AuthenticationError(
      `Invalid token: no valid signature for user ${email}`,
    );
  }
  const secret = requireEnv('TOKEN_SECRET');
  const decoded = jwt.verify(tokenStr, secret);
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
