/* global BigInt */
/* eslint-disable no-bitwise */
export const PEM = {
  pkcs8Header: '-----BEGIN PRIVATE KEY-----',
  pkcs8Footer: '-----END PRIVATE KEY-----',
};

export const CONST = {
  rsa: {
    name: 'RSA-OAEP',
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: 'SHA-256',
  },
  aes: {
    name: 'AES-CBC',
  },
  hash: {
    alg: 'SHA-256',
  },
  opensshHeader: 'ssh-rsa',
  pkcs8Header: '-----BEGIN PRIVATE KEY-----',
  pkcs8Footer: '-----END PRIVATE KEY-----',
  spkiHeader: '-----BEGIN PUBLIC KEY-----',
  spkiFooter: '-----END PUBLIC KEY-----',
};

export const uint8ToBase64 = (array) => {
  const uintArray = new Uint8Array(array);
  const base64 = window.btoa(String.fromCharCode(...uintArray));
  return base64;
};

export const base64ToUint8 = (base64) => {
  const mapper = (c) => c.charCodeAt(0);
  return Uint8Array.from(window.atob(base64), mapper);
};
export const base64Tobase64Url = (base64) => base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

export const base64UrlToBase64 = (base64url) => base64url.replace(/-/g, '+').replace(/_/g, '/');

export const privateKeyToBase64 = async (privateKey) => {
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', privateKey);
  return uint8ToBase64(pkcs8);
};

export const pkcs8ToPem = (pkcs8) => {
  const base64 = uint8ToBase64(pkcs8);
  const content = base64.replace(/.{64}/g, '$&\n');
  return `${CONST.pkcs8Header}\n${content}\n${CONST.pkcs8Footer}`;
};

export const pemToPkcs8 = (pem) => {
  const string = pem.replace(/[\n\r]/g, '');
  const regex = new RegExp(
    `^${CONST.pkcs8Header}([a-zA-Z0-9+/]+={0,2})${CONST.pkcs8Footer}`,
  );
  const match = regex.exec(string);
  if (!match || match.length !== 2) {
    throw new Error('Invalid pkcs8 Pem File');
  }
  const array = base64ToUint8(match[1]);
  return array;
};
export const pemToSpki = (pem) => {
  const string = pem.replace(/[\n\r]/g, '');
  const regex = new RegExp(
    `^${CONST.spkiHeader}([a-zA-Z0-9+/]+={0,2})${CONST.spkiFooter}`,
  );
  const match = regex.exec(string);
  if (!match || match.length !== 2) {
    throw new Error('Invalid spki Pem File');
  }
  const array = base64ToUint8(match[1]);
  return array;
};

export const base64urlToBigInt = (base64url) => {
  const base64 = base64UrlToBase64(base64url);
  const array = base64ToUint8(base64);
  let result = BigInt(0);
  for (let i = 0; i < array.length; i += 1) {
    // Shift the current byte by 8 * i bits to the left and add it to the result
    result += BigInt(array[i]) << BigInt(8 * i);
  }
  return result;
};
export const BigIntToBase64url = (bigInt) => {
  if (bigInt < BigInt(0)) {
    throw new Error('BigInt must be non-negative for Uint8Array conversion.');
  }
  // Determine the number of bytes needed to represent the BigInt
  let byteCount = 0;
  let tmp = bigInt;

  while (tmp > BigInt(0)) {
    tmp >>= BigInt(8);
    byteCount += 1;
  }
  tmp = bigInt;

  // Create a Uint8Array of the appropriate length
  const uint8Array = new Uint8Array(byteCount);

  // Fill the Uint8Array with the bytes from the BigInt
  for (let i = 0; i < byteCount; i += 1) {
    // Extract the least significant byte
    uint8Array[i] = Number(tmp & BigInt(0xFF));
    // Shift the BigInt right by 8 bits to process the next byte
    tmp >>= BigInt(8);
  }

  // Reverse the Uint8Array because bytes were extracted in little-endian order
  uint8Array.reverse();

  const base64 = uint8ToBase64(uint8Array);
  const base64url = base64Tobase64Url(base64);

  return base64url;
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
