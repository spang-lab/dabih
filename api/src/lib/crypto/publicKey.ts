
import {
  createPublicKey,
  publicEncrypt,
  constants,
  createHash,
  KeyObject,
} from 'node:crypto';
import base64url from './base64url';

const fromJwk = (key: string) => {
  const publicKey = createPublicKey({
    key,
    format: 'jwk',
  });
  return publicKey;
};

const encrypt = (key: KeyObject, base64: string) => {
  const buffer = base64url.toUint8(base64);
  const result = publicEncrypt({
    key,
    oaepHash: 'sha256',
    padding: constants.RSA_PKCS1_OAEP_PADDING,
  }, buffer);
  return base64url.fromUint8(result);
};

const toHash = (key: KeyObject) => {
  const hasher = createHash('sha256');
  const buffer = key.export({ type: 'spki', format: 'der' });
  hasher.update(buffer);
  return hasher.digest('base64url');
}


const publicKey = {
  fromJwk,
  toHash,
  encrypt,

};
export default publicKey;
