export const PEM = {
  pkcs8Header: '-----BEGIN PRIVATE KEY-----',
  pkcs8Footer: '-----END PRIVATE KEY-----',
};

export const uint8ToBase64 = (array) => {
  const uintArray = new Uint8Array(array);
  const base64 = window.btoa(String.fromCharCode(...uintArray));
  return base64;
};

export const base64ToUint8 = (base64) => Uint8Array.from(
  window.atob(base64),
  (c) => c.charCodeAt(0),
);
export const base64Tobase64Url = (base64) => base64
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_');

export const privateKeyToBase64 = async (privateKey) => {
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', privateKey);
  return uint8ToBase64(pkcs8);
};

export const pkcs8ToPem = (pkcs8) => {
  const base64 = uint8ToBase64(pkcs8);
  const content = base64.replace(/.{64}/g, '$&\n');
  return `${PEM.pkcs8Header}\n${content}\n${PEM.pkcs8Footer}`;
};

export const pemToPkcs8 = (pem) => {
  const string = pem.replace(/[\n\r]/g, '');
  const regex = new RegExp(`^${PEM.pkcs8Header}([a-zA-Z0-9+/]+={0,2})${PEM.pkcs8Footer}`);
  const match = regex.exec(string);
  if (!match || match.length !== 2) {
    throw new Error('Invalid pkcs8 Pem File');
  }
  const array = base64ToUint8(match[1]);
  return array;
};

export const privateKeyToPublicKey = async (privateKey) => {
  const jwk = await crypto.subtle.exportKey('jwk', privateKey);
  const pubJwk = {
    key_ops: ['encrypt'],
    n: jwk.n,
    alg: jwk.alg,
    e: jwk.e,
    kty: jwk.kty,
  };
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    pubJwk,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt'],
  );
  return publicKey;
};
