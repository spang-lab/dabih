import jwt from 'jsonwebtoken';
import { KeyObject } from 'crypto';

import { StringValue } from 'ms';

const decode = (token: string) => jwt.decode(token);

const signWithRSA = (
  data: object,
  privateKey: KeyObject,
  expiresIn?: StringValue,
) => {
  const token = jwt.sign(data, privateKey, {
    algorithm: 'RS256',
    expiresIn: expiresIn ?? '1h',
  });
  return token;
};

const verifyWithRSA = (token: string, publicKeys: KeyObject[]) => {
  for (const publicKey of publicKeys) {
    try {
      return jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      });
    } catch {
      // Continue to the next key if verification fails
    }
  }
  throw new Error('Token verification failed with all provided public keys');
};

const signWithSecret = (
  data: object,
  secret: string,
  expiresIn?: StringValue,
) => {
  const token = jwt.sign(data, secret, {
    algorithm: 'HS256',
    expiresIn: expiresIn ?? '1h',
  });
  return token;
};

const verifyWithSecrets = (token: string, secrets: string[]) => {
  for (const secret of secrets) {
    try {
      return jwt.verify(token, secret, {
        algorithms: ['HS256'],
      });
    } catch {
      // Continue to the next secret if verification fails
    }
  }
  throw new Error('Token verification failed with all provided secrets');
};

const jsonWebToken = {
  decode,
  signWithRSA,
  verifyWithRSA,
  signWithSecret,
  verifyWithSecrets,
};
export default jsonWebToken;
