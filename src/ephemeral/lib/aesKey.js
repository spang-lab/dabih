import { getEphemeral } from '../init.js';
import { base64ToUint8, uint8ToBase64 } from '../../crypto/index.js';

const thirtyMinutes = 30 * 60;

const store = async (mnemonic, aesKey, lifetime = thirtyMinutes) => {
  const keyData = uint8ToBase64(aesKey);
  const emphClient = getEphemeral();
  const key = `aesKey:${mnemonic}`;
  return emphClient.set(key, keyData, lifetime);
};

const get = async (mnemonic, lifetime = thirtyMinutes) => {
  const emphClient = getEphemeral();
  const key = `aesKey:${mnemonic}`;
  const keyData = await emphClient.get(key);
  if (!keyData) {
    return null;
  }
  await emphClient.touch(key, lifetime);
  const aesKey = base64ToUint8(keyData);
  return aesKey;
};

export default {
  store,
  get,
};
