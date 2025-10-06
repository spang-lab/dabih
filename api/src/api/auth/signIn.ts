import crypto from '#lib/crypto/index';
import logger from '#lib/logger';
import db from '#lib/db';
import { hasEmail, sendEmail } from '#lib/email';
import { getSecret, SECRET } from '#lib/redis/secrets';
import { SignInResponse } from '../types';
import { requireEnv } from '#lib/env';

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
  const host = requireEnv('HOST');

  const content = {
    to: email,
    subject: `Sign in to Dabih`,
    html: `<p>Click the link below to sign in to Dabih:</p>
       <p><a href="${host}/verify/${token}">Sign in</a></p>
       <p>If you did not request this, please ignore this email.</p>`,
  };
  await sendEmail(content);
  return {
    status: 'email_sent',
  };
}
