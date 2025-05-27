import jwt from 'jsonwebtoken';

import { requireEnv } from '#lib/env';
import { RegisterUser } from 'src/api/types';

const createEmailToken = (user: RegisterUser) => {
  const secret = requireEnv('EMAIL_TOKEN_SECRET');
  const token = jwt.sign(user, secret, {
    expiresIn: '15m', // 15 minutes
  });
  return token;
};

const verifyEmailToken = (token: string): RegisterUser => {
  const secret = requireEnv('EMAIL_TOKEN_SECRET');
  try {
    const decoded = jwt.verify(token, secret) as RegisterUser;
    return decoded;
  } catch {
    throw new Error('Invalid or expired email token');
  }
};

const jsonWebToken = {
  createEmailToken,
  verifyEmailToken,
};
export default jsonWebToken;
