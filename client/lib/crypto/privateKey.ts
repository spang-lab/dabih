import base64url from './base64url';
import publicKey from './publicKey';

const generate = async () => {
  const { privateKey, publicKey } = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt'],
  );
  return privateKey;
};

const toJWK = async (privateKey: CryptoKey) => crypto.subtle.exportKey('jwk', privateKey);

const toPublicKey = async (privateKey: CryptoKey) => {
  const {
    n, alg, e, kty,
  } = await toJWK(privateKey);
  const jwk = {
    key_ops: ['encrypt'],
    n,
    alg,
    e,
    kty,
  };
  return publicKey.fromJWK(jwk);
};

export default {
  generate,
  toPublicKey,
};
