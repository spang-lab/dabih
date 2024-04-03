
import {
  scrypt,
  createCipheriv,
  createDecipheriv,
  createHash
} from 'crypto';
import { promisify } from 'util';

import base64url from './base64url';
import random from './random';


const derive = async (secret: string) => {
  const salt = 'dabih';
  const keyBytes = 32;
  const derive = promisify(scrypt);
  const key = await derive(secret, salt, keyBytes) as Buffer;
  return base64url.fromUint8(key);
}

const generate = async () => {
  const bytes = await random.getBytes(32);
  return base64url.fromUint8(bytes);
}

const generateIv = async () => {
  const bytes = await random.getBytes(16);
  return base64url.fromUint8(bytes);
};

const encrypt = (key: string, iv: string) => {
  const rawKey = base64url.toUint8(key);
  const rawIv = base64url.toUint8(iv);
  const algorithm = 'aes-256-cbc';
  return createCipheriv(algorithm, rawKey, rawIv);
};

const decrypt = (key: string, iv: string) => {
  const rawKey = base64url.toUint8(key);
  const rawIv = base64url.toUint8(iv);
  const algorithm = 'aes-256-cbc';
  return createDecipheriv(algorithm, rawKey, rawIv);
}

const encryptString = (key: string, iv: string, data: string) => {
  const cipher = encrypt(key, iv);
  const encrypted = cipher.update(data, 'utf8', 'base64url');
  return encrypted + cipher.final('base64url');
};

const decryptString = (key: string, iv: string, data: string) => {
  const decipher = decrypt(key, iv);
  const decrypted = decipher.update(data, 'base64url', 'utf8');
  return decrypted + decipher.final('utf8');
};

const toHash = (key: string) => {
  const hasher = createHash('sha256');
  const buffer = base64url.toUint8(key);
  hasher.update(buffer);
  return hasher.digest('base64url');

}

const aesKey = {
  derive,
  generate,
  generateIv,
  encrypt,
  decrypt,
  encryptString,
  decryptString,
  toHash,
};


export default aesKey;
