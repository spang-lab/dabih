import { User } from '../types';
import db from '#lib/db';
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from '../errors';
import crypto from '#crypto';

export default async function token(user: User) {
  const { sub } = user;
  const dbUser = await db.user.findUnique({
    where: { sub },
  });
  if (!dbUser) {
    throw new NotFoundError('User not found');
  }
  const { emailVerified, lastAuthAt, scope } = dbUser;
  if (!emailVerified) {
    throw new AuthorizationError('Email not verified');
  }
  const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const twoWeeksAgo = new Date(Date.now() - twoWeeks);
  if (lastAuthAt < twoWeeksAgo) {
    throw new AuthenticationError(
      "User's last authentication was more than two weeks ago, re-authentication required",
    );
  }
  const payload = {
    sub,
    scope,
  };
  const token = crypto.jwt.signSecret(payload);
  return { token };
}
