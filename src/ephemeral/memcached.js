import Memcached from 'memcached';
import { promisify } from 'node:util';

import { getConfig, getEnv, log } from '../util/index.js';

import {
  aes,
  base64ToUint8,
  uint8ToBase64,
} from '../crypto/index.js';

const connect = async (url) => {
  const opts = {
    timeout: 500,
    retries: 1,
    failures: 1,
  };
  const memcached = new Memcached(url, opts);
  const connectFn = promisify(memcached.connect).bind(memcached);
  try {
    await connectFn(url);
    memcached.end();
  } catch (err) {
    log.error(err);
    throw new Error(`Failed to connect to memcached server ${url}`);
  }
};

const init = async () => {
  const opts = {
    timeout: 500,
    retries: 2,
    failures: 2,
  };

  const { ephemeral } = getConfig();
  const { url } = ephemeral;
  log(`Memcached connect to ${url}`);
  await connect(url);
  const memcached = new Memcached(url, opts);

  const ephemeralSecret = getEnv('EPHEMERAL_SECRET', null);
  if (!ephemeralSecret) {
    throw new Error('No EPHEMERAL_SECRET for memcached encryption, please set env.EPHEMERAL_SECRET');
  }
  const aesKey = await aes.deriveKey(ephemeralSecret);
  const mGet = promisify(memcached.get).bind(memcached);
  const mSet = promisify(memcached.set).bind(memcached);
  const mTouch = promisify(memcached.touch).bind(memcached);

  const get = async (key) => {
    const result = await mGet(key);
    if (!result) {
      return null;
    }
    const { iv, data } = JSON.parse(result);
    const rIv = base64ToUint8(iv);
    const decrypted = await aes.decryptString(aesKey, rIv, data);
    return JSON.parse(decrypted);
  };
  const touch = async (key, lifetime) => mTouch(key, lifetime);

  const set = async (key, value, lifetime) => {
    const iv = await aes.randomIv();
    const json = JSON.stringify(value);
    const encrypted = await aes.encryptString(aesKey, iv, json);
    const payload = JSON.stringify({
      iv: uint8ToBase64(iv),
      data: encrypted,
    });
    await mSet(key, payload, lifetime);
  };
  const close = () => {
    memcached.end();
  };
  const del = promisify(memcached.del).bind(memcached);

  return {
    get, set, close, del, touch,
  };
};

export default init;
