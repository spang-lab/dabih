import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserResponse } from "./lib/api/types";

import crypto from "./lib/crypto";
import api from "./lib/api";

const storage = window.localStorage;
export const KEY = {
  privateKey: "dabih_private_key",
  token: "dabih_token",
};






type AuthStatus =
  "loading" |
  "unauthenticated" |
  "registered_without_key" |
  "registered_key_disabled" |
  "registered" |
  "authenticated";



interface SessionContextType {
  status: AuthStatus;
  user: UserResponse | null;
  key: CryptoKey | null;
  token: string | null;
  signIn: (email: string) => Promise<void>;
  fetchUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({} as SessionContextType);

export function SessionWrapper({ children }: {
  children: React.ReactNode,
}) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);


  const fetchUser = useCallback(async () => {
    if (!token) {
      return;
    }
    const { data, error } = await api.user.me();
    if (error || !data) {
      setUser(null);
      return;
    }
    setUser(data);
  }, [setUser, token]);

  const readStorage = useCallback(async () => {
    const base64 = storage.getItem(KEY.privateKey);
    if (base64) {
      const key = await crypto.privateKey.fromBase64(base64);
      setKey(key);
    }
    const token = storage.getItem(KEY.token);
    if (token) {
      setToken(token);
    }
  }, [setKey, setToken]);



  const updateStatus = useCallback(async () => {
    if (!user) {
      setStatus("unauthenticated");
      return;
    }
    const { keys } = user;
    if (keys.length === 0) {
      setStatus("registered_without_key");
      return;
    }
    const enabledKeys = keys.filter(k => k.enabled);
    if (enabledKeys.length === 0) {
      setStatus("registered_key_disabled");
      return;
    }
    if (!key) {
      setStatus("registered");
      return;
    }
    const hash = await crypto.privateKey.toHash(key);
    const isValid = enabledKeys.some(k => k.hash === hash);
    if (!isValid) {
      storage.removeItem(KEY.privateKey);
      setKey(null);
      return;
    }
    setStatus("authenticated");
  }, [setStatus, user, key]);



  const signIn = useCallback(async (email: string) => {
    const { data, error } = await api.auth.signIn(email);
    if (error || !data) {
      console.error("Sign in error:", error);
      return;
    }
    const { status, token } = data;
    if (status === "success" && token) {
      const { data: jwt, error } = await api.auth.verify(token);
      if (error || !jwt) {
        console.error("Verification error:", error);
        return;
      }
      storage.setItem(KEY.token, jwt);
      await readStorage();
    }
  }, [readStorage]);

  const refreshToken = useCallback(async () => {
    if (!token) {
      return;
    }
    const payload = crypto.jwt.decode(token);
    const { sub, exp } = payload;
    if (!sub || !exp) {
      console.error("Invalid token payload:", payload);
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    const thirtyMinutes = 30 * 60;
    if (exp - now > thirtyMinutes) {
      return;
    }
    // TODO: Implement token refresh logic
  }, [token]);

  useEffect(() => {
    void refreshToken();
  }, [token, refreshToken]);

  useEffect(() => {
    void updateStatus();
  }, [status, updateStatus]);



  useEffect(() => {
    (async () => {
      await readStorage();
      await fetchUser();
    })().catch(console.error);
  }, [status, fetchUser, readStorage]);





  const value = useMemo(() => ({
    status,
    user,
    key,
    token,
    signIn,
    fetchUser,
  }), [status, user, key, signIn, token, fetchUser]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => useContext(SessionContext);
export default useSession;

