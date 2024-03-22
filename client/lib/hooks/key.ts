'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import storage from '../storage';
import api from '../api';
import crypto from '../crypto';

type KeyState = {
  status:
  'unauthenticated' |
  'loading' |
  'unregistered' |
  'unloaded' |
  'disabled' |
  'active',
  key?: CryptoKey,
};

export default function useKey() {
  const { status } = useSession();
  const [keyState, setKeyState] = useState<KeyState>({
    status: 'loading',
  });

  useEffect(() => {
    const listener = async () => {
      if (status !== 'authenticated') {
        setKeyState({
          status,
        });
        return;
      }
      const storedKey = await storage.readKey();
      if (!storedKey) {
        const result = await api.key.check();
        setKeyState({ status: result.status });
        return;
      }
      const hash = await crypto.privateKey.toHash(storedKey);
      const result = await api.key.check(hash);
      if (result.status === 'invalid') {
        await storage.deleteKey();
        setKeyState({
          status: 'unloaded',
        });
        return;
      }
      if (result.status === 'disabled') {
        setKeyState({ status: 'disabled' });
        return;
      }
      if (result.status === 'active') {
        setKeyState({
          status: 'active',
          key: storedKey,
        });
        return;
      }
      throw new Error(`Got unexpected key state ${result.status}`);
    };
    listener();
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [status]);

  return keyState;
}
