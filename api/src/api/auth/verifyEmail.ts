import crypto from '#lib/crypto/index';
import { getSecret, getSecrets, SECRET } from '#lib/redis/secrets';
import db from '#lib/db';
import logger from '#lib/logger';
import { getHome } from '#lib/database/inodes';
import { Scope } from '../types';

export default async function verifyEmail(tokenStr: string): Promise<string> {
  const secrets = await getSecrets(SECRET.EMAIL);
  let payload;
  try {
    payload = crypto.jwt.verifyWithSecrets(tokenStr, secrets);
    if (typeof payload !== 'object' || !payload.email || !payload.sub) {
      throw new Error('Invalid token payload');
    }
  } catch (error) {
    console.error('Email verification failed:', error);
    throw new Error('Invalid email verification token');
  }
  const { sub, email } = payload;
  if (typeof sub !== 'string' || typeof email !== 'string') {
    throw new Error('Invalid token payload structure');
  }
  const adminUser = await db.user.findFirst({
    where: {
      scope: {
        contains: Scope.ADMIN,
      },
    },
  });

  const secret = await getSecret(SECRET.AUTH);
  const existingUser = await db.user.findUnique({
    where: { sub },
  });
  if (existingUser) {
    await db.user.update({
      where: { sub },
      data: {
        lastAuthAt: new Date(),
      },
      include: {
        keys: true,
      },
    });
    const { scope } = existingUser;
    const token = crypto.jwt.signWithSecret(
      {
        sub,
        scope,
      },
      secret,
    );
    return token;
  }

  const scopes = ['dabih:base'];
  if (!adminUser) {
    logger.warn(
      `No admin user found, creating new user with admin scope for ${email}`,
    );
    scopes.push(Scope.API);
    scopes.push(Scope.ADMIN);
  }
  const scope = scopes.join(' ');

  await db.user.create({
    data: {
      sub,
      email,
      scope,
      lastAuthAt: new Date(),
    },
    include: {
      keys: true,
    },
  });
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
