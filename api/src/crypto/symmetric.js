import {
  createCipheriv,
  createDecipheriv,
  scrypt,
} from 'node:crypto';

import { promisify } from 'node:util';

import { getRandomBytes } from './util.js';

const randomIv = async () => getRandomBytes(16);
const randomKey = async () => getRandomBytes(32);

const deriveKey = async (secret) => {
  const salt = 'dabih';
  const keyBytes = 32;
  const derive = promisify(scrypt);
  const key = await derive(secret, salt, keyBytes);
  return key;
};

const encryptStream = (key, iv) => {
  const algorithm = 'aes-256-cbc';
  return createCipheriv(algorithm, key, iv);
};

const decryptStream = (key, iv) => {
  const algorithm = 'aes-256-cbc';
  return createDecipheriv(algorithm, key, iv);
};

const encryptString = async (key, iv, string) => new Promise((resolve, reject) => {
  const algorithm = 'aes-256-cbc';
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = '';
  cipher.setEncoding('hex');
  cipher.on('data', (chunk) => { encrypted += chunk; });
  cipher.on('error', reject);
  cipher.on('end', () => resolve(encrypted));
  cipher.write(string);
  cipher.end();
});

const decryptString = async (key, iv, data) => new Promise((resolve, reject) => {
  const algorithm = 'aes-256-cbc';
  const decipher = createDecipheriv(algorithm, key, iv);
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
  randomIv,
  randomKey,
  deriveKey,
};
