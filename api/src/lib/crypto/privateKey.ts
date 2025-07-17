import {
  KeyObject,
  generateKeyPair,
  createPublicKey,
  privateDecrypt,
  constants,
  createHash,
} from 'node:crypto';

import { promisify } from 'util';
import base64url from './base64url';

const generatePair = async () => {
  const generateFn = promisify(generateKeyPair);
  const { publicKey, privateKey } = await generateFn('rsa', {
    modulusLength: 4096,
    publicExponent: 0x10001,
  });
  return {
    publicKey,
    privateKey,
  };
};

const generate = async () => {
  const { privateKey } = await generatePair();
  return privateKey;
};

const toJwk = (key: KeyObject) => {
  const jwk = key.export({
    format: 'jwk',
  });
  return jwk;
};

const toPublicKey = (key: KeyObject) => {
  const { n, alg, e, kty } = toJwk(key);
  const publicKey = createPublicKey({
    key: {
      n,
      alg,
      e,
      kty,
    },
    format: 'jwk',
  });
  return publicKey;
};
const toHash = (key: KeyObject) => {
  const publicKey = toPublicKey(key);
  const buffer = publicKey.export({ type: 'spki', format: 'der' });
  const hasher = createHash('sha256');
  hasher.update(buffer);
  return hasher.digest('base64url');
};

const decrypt = (key: KeyObject, base64: string) => {
  const buffer = base64url.toUint8(base64);
  const result = privateDecrypt(
    {
      key,
      oaepHash: 'sha256',
      padding: constants.RSA_PKCS1_OAEP_PADDING,
    },
    buffer,
  );
  return base64url.fromUint8(result);
};

const privateKey = {
  generatePair,
  generate,
  decrypt,
  toJwk,
  toPublicKey,
  toHash,
};
export default privateKey;
