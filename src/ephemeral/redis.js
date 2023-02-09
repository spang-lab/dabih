import { createClient } from 'redis';
import { getConfig, getEnv, log } from '../util/index.js';

import {
  aes,
  base64ToUint8,
  uint8ToBase64,
} from '../crypto/index.js';

const init = async () => {
  const { ephemeral } = getConfig();
  const { url } = ephemeral;
  log(`Redis connect to ${url}`);

  const ephemeralSecret = getEnv('EPHEMERAL_SECRET', null);
  if (!ephemeralSecret) {
    throw new Error('No EPHEMERAL_SECRET for redis encryption, please set env.EPHEMERAL_SECRET');
  }
  const client = createClient({ url });
  try {
    await client.connect();
  } catch (err) {
    log.err(err);
    throw new Error(`Failed to connect to redis server ${url}`);
  }
  const aesKey = await aes.deriveKey(ephemeralSecret);

  const get = async (key) => {
    const result = await client.get(key);
    if (!result) {
      return null;
    }
    const { iv, data } = JSON.parse(result);
    const rIv = base64ToUint8(iv);
    const decrypted = await aes.decryptString(aesKey, rIv, data);
    return JSON.parse(decrypted);
  };
  const touch = async (key, lifetime) => {
    await client.expire(key, lifetime);
  };

  const set = async (key, value, lifetime) => {
    const iv = await aes.randomIv();
    const json = JSON.stringify(value);
    const encrypted = await aes.encryptString(aesKey, iv, json);
    const payload = JSON.stringify({
      iv: uint8ToBase64(iv),
      data: encrypted,
    });
    await client.set(key, payload);
    await client.expire(key, lifetime);
  };

  const del = async (key) => {
    await client.del(key);
  };

  const close = async () => {
    await client.disconnect();
  };

  return {
    get, set, close, del, touch,
  };
};

export default init;
