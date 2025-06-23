import crypto from '#lib/crypto/index';
import { AuthToken } from '../types';
import logger from '#lib/logger';
import db from '#lib/db';
import { hasEmail } from '#lib/email';

export default async function signIn(email: string): Promise<AuthToken | null> {
  const existingUser = await db.user.findUnique({
    where: { email },
  });
  if (!existingUser) {
    logger.info(`New user registration attempt for email: ${email}`);
  }
  const sub = existingUser?.sub ?? (await crypto.random.getToken(10));
  const token = crypto.jwt.createEmailToken({ sub, email });

  if (!hasEmail()) {
    logger.warn('Email service is not available. Returning token directly');
    return {
      token,
    };
  }
  throw new Error(
    'Unimplemented auth flow, email service is required for this operation',
  );
  return null;
}
