import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserResponse } from "./lib/api/types";

import crypto from "./lib/crypto";
import api from "./lib/api";
const storageKey = "dabih_private_key";
const storage = window.localStorage;

async function readKey() {
  const base64 = storage.getItem(storageKey);
  if (!base64) {
    return null;
  }
  return crypto.privateKey.fromBase64(base64);
}

async function writeKey(key: CryptoKey) {
  const base64 = await crypto.privateKey.toBase64(key);
  storage.setItem(storageKey, base64);
}

async function deleteKey() {
  storage.removeItem(storageKey);
}

type AuthStatus =
  "loading" |
  "unauthenticated" |
  "unregistered" |
  "registered_without_key" |
  "registered_key_disabled" |
  "registered" |
  "authenticated";



interface SessionContextType {
  status: AuthStatus;
  user: UserResponse | null;
  key: CryptoKey | null;
  signIn: (email: string) => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({} as SessionContextType);

export function SessionWrapper({ children }: {
  children: React.ReactNode,
}) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<UserResponse | null>(null);
  const [key, setKey] = useState<CryptoKey | null>(null);


  const fetchUser = useCallback(async () => {
    const { data, error } = await api.user.me();
    if (error || !data) {
      setUser(null);
      return;
    }
    setUser(data);
  }, [setUser]);

  const loadKey = useCallback(async () => {
    const storedKey = await readKey();
    setKey(storedKey);
  }, [setKey]);

  const updateStatus = useCallback(async () => {
    if (!user) {
      setStatus("unauthenticated");
      return;
    }
  }, [setStatus, user]);

  const signIn = useCallback(async (email: string) => {
    const { data, error } = await api.auth.signIn(email);
    console.log("Sign in response:", data, error);


  }, []);



  useEffect(() => {
    if (status !== "loading") {
      return;
    }
    (async () => {
      await fetchUser();
      await loadKey();
      await updateStatus();
    })().catch(console.error);
  }, [status, updateStatus, fetchUser, loadKey]);





  const value = useMemo(() => ({
    status,
    user,
    key,
    signIn,
  }), [status, user, key, signIn]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => useContext(SessionContext);
export default useSession;

