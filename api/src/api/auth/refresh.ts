import db from '#lib/db';
import { AuthenticationError, NotFoundError } from '../errors';
import crypto from '#crypto';
import { getSecret, SECRET } from '#lib/redis/secrets';
import { Scope, User, UserResponse } from '../types';

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

export default async function refresh(user: User, tokenStr: string) {
  const { sub } = user;
  const dbUser = await db.user.findUnique({
    where: { sub },
    include: {
      keys: {
        where: {
          enabled: { not: null },
        },
      },
    },
  });
  if (!dbUser) {
    throw new NotFoundError(`User not found: ${sub}`);
  }
  const keys = dbUser.keys.map((key) => crypto.publicKey.fromString(key.data));
  try {
    const payload = crypto.jwt.verifyWithRSA(tokenStr, keys);
    if (typeof payload === 'string' || payload.sub !== sub) {
      throw new AuthenticationError('Invalid token payload');
    }
  } catch {
    throw new AuthenticationError(
      `Invalid token: no valid signature for user ${dbUser.email}`,
    );
  }
  const { lastAuthAt } = dbUser;
  const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = new Date(Date.now() - twoWeeks);
  if (lastAuthAt < twoWeeksAgo) {
    throw new AuthenticationError(
      "User's last authentication was more than two weeks ago, re-authentication required",
    );
  }

  const scope = getScope(dbUser);
  await db.user.update({
    where: { sub },
    data: {
      scope,
    },
  });

  const secret = await getSecret(SECRET.AUTH);
  const token = crypto.jwt.signWithSecret(
    {
      sub,
      scope,
    },
    secret,
  );
  return token;
}
