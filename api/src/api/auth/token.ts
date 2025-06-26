import db from '#lib/db';
import { AuthenticationError, NotFoundError } from '../errors';
import crypto from '#crypto';
import { getSecret, SECRET } from '#lib/redis/secrets';

export default async function token(tokenStr: string) {
  const payload = crypto.jwt.decode(tokenStr);
  if (!payload || typeof payload !== 'object') {
    throw new AuthenticationError('Invalid token: not a valid JWT');
  }
  if (!payload.email || typeof payload.email !== 'string') {
    throw new AuthenticationError(
      'Invalid token: no "email" key in payload, this is not a signIn token',
    );
  }
  const { email } = payload;
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
    throw new NotFoundError(`User not found: ${email}`);
  }
  const keys = user.keys.map((key) => crypto.publicKey.fromString(key.data));
  try {
    crypto.jwt.verifyWithRSA(tokenStr, keys);
  } catch {
    throw new AuthenticationError(
      `Invalid token: no valid signature for user ${email}`,
    );
  }
  const { lastAuthAt, scope, sub } = user;
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
