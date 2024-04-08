import { promisify } from 'node:util';
import { randomFill } from 'node:crypto';

import base64url from './base64url.js';

const getBytes = async (n: number) => {
  const rFill = promisify(randomFill);
  const data = new Uint8Array(n);
  const buffer = await rFill(data) as Buffer;
  return buffer;
};

const getToken = async (len = 8) => {
  const bitsPerChar = 6;
  const bitsPerByte = 8;

  const requiredBits = len * bitsPerChar;
  const requiredBytes = Math.ceil(requiredBits / bitsPerByte);
  const bytes = await getBytes(requiredBytes);
  return base64url.fromUint8(bytes);
};

export default {
  getToken,
  getBytes,
};
