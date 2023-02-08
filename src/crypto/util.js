import { promisify } from 'node:util';

import { randomFill } from 'node:crypto';

export const uint8ToBase64 = (array) => Buffer.from(array).toString('base64');
export const base64ToUint8 = (base64) => new Uint8Array(Buffer.from(base64, 'base64'));

export const uint8ToBase64Url = (array) => Buffer.from(array).toString('base64url');
export const base64ToBase64Url = (base64) => Buffer.from(base64, 'base64').toString('base64url');
export const base64UrlToBase64 = (base64url) => Buffer.from(base64url, 'base64url').toString('base64');

export const getRandomBytes = async (n) => {
  const rFill = promisify(randomFill);
  const data = new Uint8Array(n);
  return rFill(data);
};

export const randomToken = async (len = 8) => {
  const bitsPerChar = 6;
  const bitsPerByte = 8;

  const requiredBits = len * bitsPerChar;
  const requiredBytes = Math.ceil(requiredBits / bitsPerByte);
  const bytes = await getRandomBytes(requiredBytes);
  const base64 = uint8ToBase64Url(bytes);
  return base64;
};

export const pkcs8ToPem = (pkcs8Key) => {
  const array = new Uint8Array(pkcs8Key);
  const base64 = uint8ToBase64(array);
  const content = base64.replace(/.{64}/g, '$&\n');
  return `-----BEGIN PRIVATE KEY-----\n${content}\n-----END PRIVATE KEY-----`;
};
