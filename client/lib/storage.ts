import { useState, useEffect } from 'react';
import crypto from './crypto';

const isAvailable = () => {
  try {
    const storage = window.localStorage;
    const testKey = '__storage_test__';
    const testData = '__storage_test__';
    storage.setItem(testKey, testData);
    storage.removeItem(testKey);
    return true;
  } catch (err) {
    return false;
  }
};

const storageKey = 'dabihPrivateKey';

const storeKey = async (key: CryptoKey) => {
  const storage = window.localStorage;
  const base64 = await crypto.privateKey.toBase64(key);
  storage.setItem(storageKey, base64);
  window.dispatchEvent(new Event('storage'));
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

const deleteKey = async () => {
  const storage = window.localStorage;
  storage.removeItem(storageKey);
  window.dispatchEvent(new Event('storage'));
};

const useKey = () => {
  const [key, setKey] = useState<CryptoKey | null>(null);
  useEffect(() => {
    const listener = async () => {
      setKey(await readKey());
    };
    listener();
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, []);
  return key;
};

export default {
  isAvailable,
  storeKey,
  useKey,
  readKey,
  deleteKey,
};
