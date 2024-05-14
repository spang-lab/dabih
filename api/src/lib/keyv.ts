import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import KeyvMemcache from '@keyv/memcache';

import logger from '#lib/logger';
import { getEnv } from '#lib/env';

import crypto from '#crypto';

let store: Keyv<string> | null = null;
let aesKey: string | null = null;

export const initKeyV = async (url?: string, secret?: string) => {
  store = createStore(url);
  aesKey = await deriveKey(secret);
};
export const createStore = (url?: string) => {
  const emphemeralUrl = url ?? getEnv('EPHEMERAL_URL', 'memory');
  if (emphemeralUrl === 'memory') {
    logger.info('Memory adapter selected. You will need another adapter if you use multiple replicas.');
    return new Keyv();
  }
  if (!emphemeralUrl.includes(':')) {
    throw new Error(`Could not parse url ${emphemeralUrl},
      needs to be of the form "<backend>:<path>"`);
  }
  const [backend, path] = emphemeralUrl.split(':', 2);
  if (backend === 'redis') {
    const keyvRedis = new KeyvRedis(emphemeralUrl);
    return new Keyv({
      store: keyvRedis,
    });
  }
  if (backend === 'memcached') {
    const keyvMemcache = new KeyvMemcache(path);
    return new Keyv({
      store: keyvMemcache,
    });
  }
  throw new Error(`Invalid emphemeral adapter "${backend}", options are "memcached" or "memory"`);
}

export const deriveKey = async (secret?: string) => {
  const randomSecret = await crypto.random.getToken(10);
  const s = secret ?? getEnv('EPHEMERAL_SECRET', randomSecret);
  const key = await crypto.aesKey.derive(s, 'ephemeral');
  return key;
};

export const storeKey = async (sub: string, mnemonic: string, key: string) => {
  if (!store || !aesKey) {
    throw new Error('Ephemeral store not initialized');
  }
  const iv = await crypto.aesKey.generateIv();
  const encrypted = crypto.aesKey.encryptString(aesKey, iv, key);
  const timestamp = +new Date();
  await store.set(`iv:${sub}:${mnemonic}`, iv);
  await store.set(`timestamp:${sub}:${mnemonic}`, timestamp.toString());
  await store.set(`aesKey:${sub}:${mnemonic}`, encrypted);
};

export const readKey = async (sub: string, mnemonic: string) => {
  if (!store || !aesKey) {
    throw new Error('Ephemeral store not initialized');
  }
  const iv = await store.get(`iv:${sub}:${mnemonic}`);
  const encrypted = await store.get(`aesKey:${sub}:${mnemonic}`);
  if (!encrypted || !iv) {
    return null;
  }
  const key = crypto.aesKey.decryptString(aesKey, iv, encrypted)
  const timestamp = +new Date();
  await store.set(`timestamp:${sub}:${mnemonic}`, timestamp.toString());
  return key;
};

export const deleteKey = async (sub: string, mnemonic: string) => {
  if (!store) {
    throw new Error('Ephemeral store not initialized');
  }
  await store.delete(`iv:${sub}:${mnemonic}`);
  await store.delete(`aesKey:${sub}:${mnemonic}`);
  await store.delete(`timestamp:${sub}:${mnemonic}`);
};

export const isExpired = async (sub: string, mnemonic: string) => {
  if (!store) {
    throw new Error('Ephemeral store not initialized');
  }
  const timestampStr = await store.get(`timestamp:${sub}:${mnemonic}`);
  if (!timestampStr) {
    return false;
  }
  const timestamp = parseInt(timestampStr, 10);
  const now = +new Date();

  const oneHourMs = 60 * 60 * 1000;
  return (now - timestamp) > oneHourMs;
};


