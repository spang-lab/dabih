import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import KeyvMemcache from '@keyv/memcache';
import {
  log, parseUrl,
  getEnv,
} from '../util/index.js';
import { aes, random } from '../crypto/index.js';

let store = null;
let aesKey = null;

export const initEphemeral = async () => {
  const emphemeralUrl = getEnv('EPHEMERAL_URL', 'memory');
  const randomSecret = await random.getToken(32);
  const secret = getEnv('EPHEMERAL_SECRET', randomSecret);
  aesKey = await aes.deriveKey(secret);

  if (emphemeralUrl === 'memory') {
    log('Memory adapter selected. You will need another adapter if you use multiple replicas.');
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

export const storeKey = async (mnemonic, key) => {
  const iv = await aes.generateIv();
  const encrypted = await aes.encryptString(aesKey, iv, key);
  const timestamp = +new Date();
  await store.set(`iv:${mnemonic}`, iv);
  await store.set(`timestamp:${mnemonic}`, timestamp);
  await store.set(`aesKey:${mnemonic}`, encrypted);
};

export const readKey = async (mnemonic) => {
  const iv = await store.get(`iv:${mnemonic}`);
  const encrypted = await store.get(`aesKey:${mnemonic}`);
  if (!encrypted || !iv) {
    return null;
  }
  const key = await aes.decryptString(aesKey, iv, encrypted)
  const timestamp = +new Date();
  await store.set(`timestamp:${mnemonic}`, timestamp);
  return key;
};

export const deleteKey = async (mnemonic) => {
  await store.delete(`iv:${mnemonic}`);
  await store.delete(`aesKey:${mnemonic}`);
  await store.delete(`timestamp:${mnemonic}`);
};

export const isExpired = async (mnemonic) => {
  const timestamp = await store.get(`timestamp:${mnemonic}`);
  if (!timestamp) {
    return false;
  }
  const now = +new Date();

  const oneHourMs = 60 * 60 * 1000;
  return (now - timestamp) > oneHourMs;
};
