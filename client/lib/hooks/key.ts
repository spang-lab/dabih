'use client';

import { useState, useEffect } from 'react';
import storage from '../storage';
import useUser from './user';
import api from '../api';
import crypto from '../crypto';

export default function useKey() {
  const user = useUser();
  const [key, setKey] = useState<CryptoKey | null>(null);
  useEffect(() => {
    const listener = async () => {
      if (user.status !== 'authenticated') {
        return;
      }
      const storedKey = await storage.readKey();
      if (!storedKey) {
        setKey(null);
        return;
      }
      const hash = await crypto.privateKey.toHash(storedKey);
      const { isValid } = await api.key.check(hash);
      if (!isValid) {
        await storage.deleteKey();
        setKey(null);
        return;
      }
      setKey(storedKey);
    };
    listener();
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [user.status]);
  return key;
}
