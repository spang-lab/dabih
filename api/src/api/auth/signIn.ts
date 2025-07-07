import crypto from '#lib/crypto/index';
import logger from '#lib/logger';
import db from '#lib/db';
import { hasEmail } from '#lib/email';
import { getSecret, SECRET } from '#lib/redis/secrets';
import { SignInResponse } from '../types';

export default async function signIn(email: string): Promise<SignInResponse> {
  const existingUser = await db.user.findUnique({
    where: { email },
  });
  const sub = existingUser?.sub ?? (await crypto.random.getToken(10));
  const secret = await getSecret(SECRET.EMAIL);
  const token = crypto.jwt.signWithSecret(
    {
      sub,
      email,
    },
    secret,
  );

  // If the user has authenticated in the last two weeks, return the token directly
  if (existingUser) {
    const { lastAuthAt } = existingUser;
    const twoWeeks = 2 * 7 * 24 * 60 * 60 * 1000;
    const twoWeeksAgo = new Date(Date.now() - twoWeeks);
    if (lastAuthAt > twoWeeksAgo) {
      return {
        status: 'success',
        token,
      };
    }
  }
  // If we cannot send an email, we return the token directly
  if (!hasEmail()) {
    logger.warn('Email service is not available. Returning token directly');
    return {
      status: 'success',
      token,
    };
  }
  // Send an email to the user if they are new or haven't authenticated in the last two weeks
  if (!existingUser) {
    logger.info(`New user registration attempt for email: ${email}`);
  }

  throw new Error(
    'Unimplemented auth flow, email service is required for this operation',
  );
}
