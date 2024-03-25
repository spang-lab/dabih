'use client';

import {
  useSession as useAuthSession,
  SessionProvider as AuthSessionProvider,
} from 'next-auth/react';
import {
  createContext, useContext, useEffect,
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

type KeyState = {
  status: KeyStatus,
  data?: CryptoKey,
};
type User = {
  scopes: string[],
  sub: string,
  name: string,
  email: string
};

type Session = {
  status:
  'unauthenticated' |
  'loading' |
  'authenticated',
  keyStatus: KeyStatus,
  user?: User,
  isAdmin: boolean,
  key?: CryptoKey,
  expires?: string,
};

const SessionContext = createContext<Session>({
  status: 'loading',
  keyStatus: 'loading',
  isAdmin: false,
});

function SessionProvider({ children }) {
  const { data, status } = useAuthSession();
  const [key, setKey] = useState<KeyState>({
    status: 'loading',
  });

  useEffect(() => {
    const listener = async () => {
      if (status !== 'authenticated') {
        setKey({
          status,
        });
        return;
      }
      const storedKey = await storage.readKey();
      if (!storedKey) {
        const result = await api.key.check();
        setKey({ status: result.status });
        return;
      }
      const hash = await crypto.privateKey.toHash(storedKey);
      const result = await api.key.check(hash);
      if (result.status === 'invalid') {
        await storage.deleteKey();
        setKey({
          status: 'unloaded',
        });
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
    };
    listener();
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [status]);

  const value = useMemo(() => ({
    status,
    keyStatus: key.status,
    key: key.data,
    user: data?.user,
    isAdmin: data?.user.scopes.includes('admin') || false,
    expires: data?.expires,
  }), [data, key, status]);

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
