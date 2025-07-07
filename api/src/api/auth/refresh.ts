import db from '#lib/db';
import { AuthenticationError, NotFoundError } from '../errors';
import crypto from '#crypto';
import { getSecret, SECRET } from '#lib/redis/secrets';

export default async function refresh(tokenStr: string) {
  const payload = crypto.jwt.decode(tokenStr);
  if (!payload || typeof payload !== 'object') {
    throw new AuthenticationError('Invalid token: not a valid JWT');
  }
  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new AuthenticationError(
      'Invalid token: no "sub" key in payload, this is not a signIn token',
    );
  }
  const { sub } = payload;
  const user = await db.user.findUnique({
    where: { sub },
    include: {
      keys: {
        where: {
          enabled: { not: null },
        },
      },
    },
  });
  if (!user) {
    throw new NotFoundError(`User not found: ${sub}`);
  }
  const keys = user.keys.map((key) => crypto.publicKey.fromString(key.data));
  try {
    crypto.jwt.verifyWithRSA(tokenStr, keys);
  } catch {
    throw new AuthenticationError(
      `Invalid token: no valid signature for user ${user.email}`,
    );
  }
  const { lastAuthAt, scope } = user;
  const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = new Date(Date.now() - twoWeeks);
  if (lastAuthAt < twoWeeksAgo) {
    throw new AuthenticationError(
      "User's last authentication was more than two weeks ago, re-authentication required",
    );
  }
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
