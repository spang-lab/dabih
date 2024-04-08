import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import KeyvMemcache from '@keyv/memcache';

import logger from '#lib/logger';
import { getEnv } from '#lib/env';

import crypto from '#crypto';

let store: Keyv<string> | null = null;
let aesKey: string | null = null;


export const parseUrl = (url: string) => {
  if (!url.includes(':')) {
    throw new Error(`Could not parse url ${url},
      needs to be of the form "<backend>:<path>"`);
  }
  const [backend, path] = url.split(':', 2);
  return { backend, path };
};


export const initKeyV = async () => {
  const emphemeralUrl = getEnv('EPHEMERAL_URL', 'memory');
  const randomSecret = await crypto.random.getToken(10);
  const secret = getEnv('EPHEMERAL_SECRET', randomSecret);

  aesKey = await crypto.aesKey.derive(secret, 'ephemeral');

  if (emphemeralUrl === 'memory') {
    logger.info('Memory adapter selected. You will need another adapter if you use multiple replicas.');
    store = new Keyv();
    return;
  }
  const { backend, path } = parseUrl(emphemeralUrl);
  if (backend === 'redis') {
    const keyvRedis = new KeyvRedis(emphemeralUrl);
    store = new Keyv({
      store: keyvRedis,
    });
    return;
  }
  if (backend === 'memcached') {
    const keyvMemcache = new KeyvMemcache(path);
    store = new Keyv({
      store: keyvMemcache,
    });
    return;
  }
  throw new Error(`Invalid emphemeral adapter "${backend}", options are "memcached" or "memory"`);
};

export const storeKey = async (mnemonic: string, key: string) => {
  if (!store || !aesKey) {
    throw new Error('Ephemeral store not initialized');
  }
  const iv = await crypto.aesKey.generateIv();
  const encrypted = crypto.aesKey.encryptString(aesKey, iv, key);
  const timestamp = +new Date();
  await store.set(`iv:${mnemonic}`, iv);
  await store.set(`timestamp:${mnemonic}`, timestamp.toString());
  await store.set(`aesKey:${mnemonic}`, encrypted);
};

export const readKey = async (mnemonic: string) => {
  if (!store || !aesKey) {
    throw new Error('Ephemeral store not initialized');
  }
  const iv = await store.get(`iv:${mnemonic}`);
  store
  const encrypted = await store.get(`aesKey:${mnemonic}`);
  if (!encrypted || !iv) {
    return null;
  }
  const key = crypto.aesKey.decryptString(aesKey, iv, encrypted)
  const timestamp = +new Date();
  await store.set(`timestamp:${mnemonic}`, timestamp.toString());
  return key;
};

export const deleteKey = async (mnemonic: string) => {
  if (!store) {
    throw new Error('Ephemeral store not initialized');
  }
  await store.delete(`iv:${mnemonic}`);
  await store.delete(`aesKey:${mnemonic}`);
  await store.delete(`timestamp:${mnemonic}`);
};

export const isExpired = async (mnemonic: string) => {
  if (!store) {
    throw new Error('Ephemeral store not initialized');
  }
  const timestampStr = await store.get(`timestamp:${mnemonic}`);
  if (!timestampStr) {
    return false;
  }
  const timestamp = parseInt(timestampStr, 10);
  const now = +new Date();

  const oneHourMs = 60 * 60 * 1000;
  return (now - timestamp) > oneHourMs;
};
