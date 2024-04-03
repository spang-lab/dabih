import {
  createCipheriv,
  createDecipheriv,
  scrypt,
} from 'node:crypto';

import { promisify } from 'node:util';

import random from './random.js';
import base64url from './base64url.js';

const deriveKey = async (secret) => {
  const salt = 'dabih';
  const keyBytes = 32;
  const derive = promisify(scrypt);
  const key = await derive(secret, salt, keyBytes);
  return base64url.fromUint8(key);
};

const generateKey = async () => {
  const bytes = await random.getBytes(32);
  return base64url.fromUint8(bytes);
};
const generateIv = async () => {
  const bytes = await random.getBytes(16);
  return base64url.fromUint8(bytes);
};

const encryptStream = (key, iv) => {
  const rawKey = base64url.toUint8(key);
  const rawIv = base64url.toUint8(iv);
  const algorithm = 'aes-256-cbc';
  return createCipheriv(algorithm, rawKey, rawIv);
};

const decryptStream = (key, iv) => {
  const rawKey = base64url.toUint8(key);
  const rawIv = base64url.toUint8(iv);
  const algorithm = 'aes-256-cbc';
  return createDecipheriv(algorithm, rawKey, rawIv);
};

const encryptString = async (key, iv, string) => new Promise((resolve, reject) => {
  const rawKey = base64url.toUint8(key);
  const rawIv = base64url.toUint8(iv);
  const algorithm = 'aes-256-cbc';
  const cipher = createCipheriv(algorithm, rawKey, rawIv);
  let encrypted = '';
  cipher.setEncoding('hex');
  cipher.on('data', (chunk) => { encrypted += chunk; });
  cipher.on('error', reject);
  cipher.on('end', () => resolve(encrypted));
  cipher.write(string);
  cipher.end();
});

const decryptString = async (key, iv, data) => new Promise((resolve, reject) => {
  const rawKey = base64url.toUint8(key);
  const rawIv = base64url.toUint8(iv);
  const algorithm = 'aes-256-cbc';
  const decipher = createDecipheriv(algorithm, rawKey, rawIv);
  let decrypted = '';
  decipher.on('readable', () => {
    let chunk = decipher.read();
    while (chunk !== null) {
      decrypted += chunk.toString('utf8');
      chunk = decipher.read();
    }
  });
  decipher.on('end', () => {
    resolve(decrypted);
  });
  decipher.on('error', (err) => reject(err));
  decipher.write(data, 'hex');
  decipher.end();
});

export default {
  encryptString,
  decryptString,
  encryptStream,
  decryptStream,
  generateKey,
  generateIv,
  deriveKey,
};
