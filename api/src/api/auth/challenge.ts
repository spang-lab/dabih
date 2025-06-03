import crypto from '#lib/crypto/index';
import db from '#lib/db';
import { NotFoundError } from '../errors';

import { storeChallenge } from '#lib/redis/challenge';

export default async function challenge(email: string) {
  const user = await db.user.findUnique({
    where: { email },
    include: {
      keys: {
        where: {
          enabled: {
            not: null,
          },
        },
      },
    },
  });
  if (!user) {
    throw new NotFoundError(`User with email ${email} not found`);
  }
  const { sub, keys } = user;
  if (keys.length === 0) {
    throw new NotFoundError(
      `No enabled keys found for user with email ${email}`,
    );
  }
  const challenge = await crypto.random.getToken(64);
  await storeChallenge(sub, challenge);

  const results = keys.map((key) => {
    const publicKey = crypto.publicKey.fromString(key.data);
    const encrypted = crypto.publicKey.encrypt(publicKey, challenge);
    return {
      hash: key.hash,
      encrypted,
    };
  });
  return {
    sub,
    challenges: results,
  };
}
