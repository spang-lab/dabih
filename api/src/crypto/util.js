import { promisify } from 'node:util';

import { randomFill } from 'node:crypto';

export const uint8ToBase64 = (array) => Buffer.from(array).toString('base64url');
export const base64ToUint8 = (base64) => new Uint8Array(Buffer.from(base64, 'base64url'));

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
  const base64 = uint8ToBase64(bytes);
  return base64;
};
