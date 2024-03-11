import base64url from './base64url';

const fromJWK = async (jwk: any) => crypto.subtle.importKey(
  'jwk',
  jwk,
  {
    name: 'RSA-OAEP',
    hash: 'SHA-256',
  },
  true,
  ['encrypt'],
);

const hash = async (publicKey: CryptoKey) => {
  const spki = await crypto.subtle.exportKey('spki', publicKey);
  const buffer = await crypto.subtle.digest('SHA-256', spki);
  return base64url.fromUint8(buffer);
};

export default {
  fromJWK,
  hash,
};
