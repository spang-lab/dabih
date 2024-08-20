import crypto from "./crypto";

const isAvailable = () => {
  try {
    const storage = window.localStorage;
    const testKey = "__storage_test__";
    const testData = "__storage_test__";
    storage.setItem(testKey, testData);
    storage.removeItem(testKey);
    return true;
  } catch (err) {
    return false;
  }
};

const storageKey = "dabihPrivateKey";
const EVENT_NAME = "storage";

const storeKey = async (key: CryptoKey) => {
  const storage = window.localStorage;
  const base64 = await crypto.privateKey.toBase64(key);
  storage.setItem(storageKey, base64);
  window.dispatchEvent(new Event(EVENT_NAME));
};

const readKey = async () => {
  const storage = window.localStorage;
  const base64 = storage.getItem(storageKey);
  if (!base64) {
    return null;
  }
  const key = await crypto.privateKey.fromBase64(base64);
  return key;
};

const deleteKey = () => {
  const storage = window.localStorage;
  storage.removeItem(storageKey);
  window.dispatchEvent(new Event(EVENT_NAME));
};

const update = () => {
  window.dispatchEvent(new Event(EVENT_NAME));
};

const storage = {
  isAvailable,
  storeKey,
  readKey,
  deleteKey,
  EVENT_NAME,
  update,
};
export default storage;
