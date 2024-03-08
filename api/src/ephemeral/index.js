import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import KeyvMemcache from '@keyv/memcache';
import {
  log, getEnv, requireEnv, parseUrl,
} from '../util/index.js';

let store = null;

export const initEphemeral = async () => {
  const emphemeralUrl = requireEnv('EPHEMERAL_URL');
  const secret = getEnv('EPHEMERAL_SECRET', null);

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
  const timestamp = +new Date();
  await store.set(`timestamp:${mnemonic}`, timestamp);
  await store.set(`aesKey:${mnemonic}`, key);
};

export const readKey = async (mnemonic) => {
  const key = store.get(`aesKey:${mnemonic}`);
  if (!key) {
    return null;
  }
  const timestamp = +new Date();
  await store.set(`timestamp:${mnemonic}`, timestamp);
  return key;
};

export const deleteKey = async (mnemonic) => {
  await store.delete(`aesKey:${mnemonic}`);
  await store.delete(`timestamp:${mnemonic}`);
};

export const isExpired = async (mnemonic) => {
  const timestamp = await store.get(`timestamp:${mnemonic}`);
  if (!timestamp) {
    return false;
  }
  const now = +new Date();

  const oneHourMs = 10;// 60 * 60 * 1000;
  return (now - timestamp) > oneHourMs;
};
