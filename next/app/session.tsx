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
interface User {
  scopes: string[],
  sub: string,
  name: string,
  email: string
}

interface Session {
  status:
  'unauthenticated' |
  'loading' |
  'authenticated',
  keyStatus: KeyStatus,
  user?: User,
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
  update: () => { },
});

function SessionProvider({ children }) {
  const { data, status } = useAuthSession();
  console.log(data, status);
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
    const storedKey = await storage.readKey();
    if (!storedKey) {
      const result = await api.key.check();
      if (result.status === 'unregistered' || result.status === 'unloaded') {
        setKey({ status: result.status });
      } else {
        throw new Error(`Got unexpected key state ${result.status}`);
      }
      return;
    }
    const hash = await crypto.privateKey.toHash(storedKey);
    const result = await api.key.check(hash);
    if (result.status === 'invalid') {
      await storage.deleteKey();
      checkKey();
      return;
    }
    if (result.status === 'disabled') {
      setKey({ status: 'disabled' });
      return;
    }
    if (result.status === 'active') {
      setKey({
        status: 'active',
        data: storedKey,
      });
      return;
    }
    throw new Error(`Got unexpected key state ${result.status}`);
  }, [status]);

  useEffect(() => {
    checkKey();
  }, [status, checkKey]);

  const value = useMemo(() => ({
    status,
    keyStatus: key.status,
    key: key.data,
    user: data?.user,
    isAdmin: data?.user.scopes.includes('admin') || false,
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
