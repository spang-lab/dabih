import { getEphemeral } from '../init.js';
import { base64ToUint8, uint8ToBase64 } from '../../crypto/index.js';

const lifetimeSeconds = 30 * 60;

const store = async (mnemonic, aesKey) => {
  const keyData = uint8ToBase64(aesKey);
  const emphClient = getEphemeral();
  const key = `upload:${mnemonic}`;
  return emphClient.set(key, keyData, lifetimeSeconds);
};

const get = async (mnemonic) => {
  const emphClient = getEphemeral();
  const key = `upload:${mnemonic}`;
  const keyData = await emphClient.get(key);
  if (!keyData) {
    return null;
  }
  await emphClient.touch(key, lifetimeSeconds);
  const aesKey = base64ToUint8(keyData);
  return aesKey;
};

export default {
  store,
  get,
};
