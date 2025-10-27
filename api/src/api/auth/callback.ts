import { authorizationCode, getUserInfo } from '#lib/openid/index';
import { getCodeVerifier } from '#lib/redis/codeVerifier';
import { Request } from 'koa';
import { RequestError } from '../errors';
import db from '#lib/db';
import { Scope, UserResponse } from '../types';
import crypto from '#lib/crypto/index';
import { getSecret, SECRET } from '#lib/redis/secrets';
import logger from '#lib/logger';
import { getHome } from '#lib/database/inodes';

const getNewScope = async () => {
  const existingAdmin = await db.user.findFirst({
    where: {
      scope: {
        contains: Scope.ADMIN,
      },
    },
  });
  const scopes: string[] = [Scope.BASE];
  if (!existingAdmin) {
    logger.warn(`No admin user found, creating new user with admin scope`);
    scopes.push(Scope.API);
    scopes.push(Scope.ADMIN);
  }
  const scope = scopes.join(' ');
  return scope;
};

const getScope = (user: UserResponse) => {
  const scopes = new Set<string>([Scope.BASE]);
  const { keys } = user;
  if (keys.some((k) => k.enabled)) {
    scopes.add(Scope.API);
  }
  if (user.scope.includes(Scope.ADMIN)) {
    scopes.add(Scope.ADMIN);
  }
  return Array.from(scopes).join(' ');
};

export default async function callback(request: Request, state: string) {
  const codeVerifier = await getCodeVerifier(state);
  if (!codeVerifier) {
    throw new RequestError('Could not find code verifier in redis');
  }

  const access_token = await authorizationCode(request, state, codeVerifier);
  const { sub, email } = await getUserInfo(access_token);

  const secret = await getSecret(SECRET.AUTH);

  const emailMatch = await db.user.findUnique({
    where: {
      email,
    },
  });
  if (emailMatch && emailMatch.sub !== sub) {
    throw new RequestError(
      `Email ${email} is already associated with another account.`,
    );
  }

  const existing = await db.user.findUnique({
    where: {
      sub,
    },
    include: {
      keys: true,
    },
  });
  if (existing) {
    const scope = getScope(existing);
    await db.user.update({
      where: { sub },
      data: {
        email,
        lastAuthAt: new Date(),
        scope,
      },
    });
    const token = crypto.jwt.signWithSecret(
      {
        sub,
        scope,
      },
      secret,
    );
    return token;
  }

  const scope = await getNewScope();
  try {
    await db.user.create({
      data: {
        sub,
        email,
        scope,
        lastAuthAt: new Date(),
      },
    });
  } catch (e) {
    throw new RequestError(`Could not create user: ${(e as Error).message}`);
  }
  await getHome(sub);
  const token = crypto.jwt.signWithSecret(
    {
      sub,
      scope,
    },
    secret,
  );
  return token;
}
