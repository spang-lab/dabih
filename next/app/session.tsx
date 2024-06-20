'use client';

import {
  useSession as useAuthSession,
  SessionProvider as AuthSessionProvider,
} from 'next-auth/react';
import {
  createContext, useCallback, useContext, useEffect,
  useMemo,
  useState,
} from 'react';
import storage from '@/lib/storage';
import api from '@/lib/api';
import crypto from '@/lib/crypto';
import { Session as AuthSession } from 'next-auth';

type KeyStatus =
  'unauthenticated' |
  'loading' |
  'unregistered' |
  'unloaded' |
  'disabled' |
  'active';

interface KeyState {
  status: KeyStatus,
  data?: CryptoKey,
}

interface Session {
  status:
  'unauthenticated' |
  'loading' |
  'authenticated',
  keyStatus: KeyStatus,
  user?: AuthSession['user'],
  isAdmin: boolean,
  key?: CryptoKey,
  expires?: string,
  error?: string,
  update: () => void,
}

const SessionContext = createContext<Session>({
  status: 'loading',
  keyStatus: 'loading',
  isAdmin: false,
  update: () => { console.error('Session not ready yet'); },
});

function SessionProvider({ children }) {
  const { data, status } = useAuthSession();
  const [key, setKey] = useState<KeyState>({
    status: 'loading',
  });

  const checkKey = useCallback(async () => {
    if (status !== 'authenticated') {
      setKey({
        status,
      });
      return;
    }
    const { data: user, response } = await api.user.me();
    if (response.status === 204 || !user) {
      setKey({
        status: 'unregistered',
      });
      return;
    }
    const { keys } = user;
    const storedKey = await storage.readKey();
    if (!storedKey) {
      if (keys.length > 0) {
        setKey({
          status: 'unloaded',
        });
        return;
      } else {
        setKey({
          status: 'unregistered',
        });
        return;
      }
    }
    const hash = await crypto.privateKey.toHash(storedKey);
    const match = keys.find((k) => k.hash === hash);
    if (!match) {
      await storage.deleteKey();
      setKey({
        status: 'unloaded',
      });
      return;
    }
    if (match.enabled) {
      setKey({
        status: 'active',
        data: storedKey,
      });
      return;
    }
    setKey({
      status: 'disabled',
    });
  }, [status]);

  useEffect(() => {
    checkKey().catch(console.error);
  }, [status, checkKey]);

  const value = useMemo(() => ({
    status,
    keyStatus: key.status,
    key: key.data,
    user: data?.user,
    isAdmin: data?.user.scopes.includes('admin') ?? false,
    expires: data?.expires,
    update: checkKey,
  }), [data, key, status, checkKey]);

  return (
    <AuthSessionProvider>
      <SessionContext.Provider value={value}>
        {children}
      </SessionContext.Provider>
    </AuthSessionProvider>
  );
}

export function SessionWrapper({ children }) {
  return (
    <AuthSessionProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </AuthSessionProvider>
  );
}

const useSession = () => useContext(SessionContext);
export default useSession;
