import jwt from 'jsonwebtoken';
import { KeyObject } from 'crypto';

import { requireEnv } from '#lib/env';

interface User {
  sub: string;
  email: string;
}

const createEmailToken = (user: User) => {
  const secret = requireEnv('EMAIL_TOKEN_SECRET');
  const token = jwt.sign(user, secret, {
    expiresIn: '15m', // 15 minutes
  });
  return token;
};

const verifyEmailToken = (token: string): User => {
  const secret = requireEnv('EMAIL_TOKEN_SECRET');
  try {
    const decoded = jwt.verify(token, secret) as User;
    return decoded;
  } catch {
    throw new Error('Invalid or expired email token');
  }
};

const signRSA = (data: object, key: KeyObject) => {
  const token = jwt.sign(data, key, {
    algorithm: 'RS256',
    expiresIn: '1h',
  });
  return token;
};

const signSecret = (data: object) => {
  const secret = requireEnv('JWT_SECRET');
  const token = jwt.sign(data, secret, {
    algorithm: 'HS256',
    expiresIn: '1h',
  });
  return token;
};

const jsonWebToken = {
  signRSA,
  signSecret,
  createEmailToken,
  verifyEmailToken,
};
export default jsonWebToken;
