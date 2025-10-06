import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserResponse } from "./lib/api/types";

import crypto from "./lib/crypto";
import api, { setAPIToken } from "./lib/api";
import { OpenIDProvider } from "./lib/api/types/auth";

const KEY = {
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
  error: string | null;
  isAdmin: boolean;
  user: UserResponse | null;
  key: CryptoKey | null;
  token: string | null;
  provider: OpenIDProvider | null;
  clearError: () => void;
  signIn: (email: string) => Promise<void>;
  verifyToken: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveKey: (privateKey: CryptoKey) => Promise<void>;
  dropKey: () => Promise<void>;
  update: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({} as SessionContextType);

export function SessionWrapper({ children }: {
  children: React.ReactNode,
}) {
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [provider, setProvider] = useState<OpenIDProvider | null>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      const { data, error } = await api.auth.provider();
      if (error || !data) {
        console.error("Failed to fetch OpenID configuration:", error);
        return;
      }
      setProvider(data);
    };
    void fetchProvider();
  }, []);



  const update = useCallback(async () => {
    const token = localStorage.getItem(KEY.token);
    const base64 = localStorage.getItem(KEY.privateKey);
    setToken(token);
    setAPIToken(token);
    if (!token) {
      setUser(null);
      return;
    }
    const { data, error } = await api.user.me();
    if (error || !data) {
      setUser(null);
      return;
    }
    setUser(data);
    if (base64) {
      const key = await crypto.privateKey.fromBase64(base64);
      const hash = await crypto.privateKey.toHash(key);
      const userKey = data.keys.find(k => k.hash === hash);
      if (!userKey || !userKey.enabled) {
        localStorage.removeItem(KEY.privateKey);
        setKey(null);
        return;
      }
      setKey(key);
    } else {
      setKey(null);
    }
  }, [setKey, setToken, setUser]);



  const getStatus = useCallback((): AuthStatus => {
    if (!user) {
      return "unauthenticated";
    }
    const { keys } = user;
    if (keys.length === 0) {
      return "registered_without_key";
    }
    const enabledKeys = keys.filter(k => k.enabled);
    if (enabledKeys.length === 0) {
      return "registered_key_disabled";
    }
    if (!key) {
      return "registered";
    }
    return "authenticated";
  }, [user, key]);

  const verifyToken = useCallback(async (token: string) => {
    const { data: jwt, error } = await api.auth.verify(token);
    if (error || !jwt) {
      setError(`Verification failed with error: ${error!.message}`);
      return;
    }
    localStorage.setItem(KEY.token, jwt);
    await update();
  }, [update]);


  const signIn = useCallback(async (email: string) => {
    const { data, error } = await api.auth.signIn(email);
    if (error || !data) {
      setError(`Sign in failed for`);
      return;
    }
    const { status, token } = data;
    if (status === "success" && token) {
      await verifyToken(token);
    }
  }, [verifyToken]);



  const refreshToken = useCallback(async () => {
    let sub = null;
    if (token) {
      const payload = crypto.jwt.decode(token);
      const { exp } = payload;
      sub = payload.sub;
      if (!exp) {
        console.error("Invalid token payload:", payload);
        return;
      }
      const now = Math.floor(Date.now() / 1000);
      const thirtyMinutes = 30 * 60;
      if (exp - now > thirtyMinutes) {
        // Token is still valid no need to refresh
        return;
      }
    }
    if (!key) {
      return;
    }
    if (!sub) {
      const hash = await crypto.privateKey.toHash(key);
      const { data: user, error } = await api.user.findKey(hash);
      if (error || !user) {
        console.error("Key lookup error:", error);
        return;
      }
      sub = user.sub;
    }
    const signingKey = await crypto.privateKey.toSigningKey(key);
    const signedToken = await crypto.jwt.signWithRSA({ sub }, signingKey);

    const { data: newToken, error: error2 } = await api.auth.refresh(signedToken);
    if (error2 || !newToken) {
      console.error("Token refresh error:", error2);
      return;
    }
    localStorage.setItem(KEY.token, newToken);
    await update();
  }, [token, key, update]);


  const saveKey = useCallback(async (privateKey: CryptoKey) => {
    const hash = await crypto.privateKey.toHash(privateKey);
    if (!user) {
      const { data: u, error } = await api.user.findKey(hash);
      if (error || !u) {
        throw new Error(`Key with hash ${hash} not found`);
      }
      const key = u.keys.find(k => k.hash === hash);
      if (!key) {
        throw new Error(`This should not happen, key with hash ${hash} not found in user record`);
      }
      const signingKey = await crypto.privateKey.toSigningKey(privateKey);
      const signedToken = await crypto.jwt.signWithRSA({ sub: u.sub }, signingKey);
      const { data: newToken, error: error2 } = await api.auth.refresh(signedToken);
      if (error2 || !newToken) {
        throw new Error(`Token refresh failed`);
      }
      localStorage.setItem(KEY.token, newToken);


      const base64 = await crypto.privateKey.toBase64(privateKey);
      localStorage.setItem(KEY.privateKey, base64);
      await update();
      return;
    }
    const userKey = user.keys.find(k => k.hash === hash);
    if (!userKey) {
      throw new Error(`Key with hash ${hash} does not belong to user ${user.email}`);
    }
    if (!userKey.enabled) {
      throw new Error("This key needs to be enabled first");
    }
    const base64 = await crypto.privateKey.toBase64(privateKey);
    localStorage.setItem(KEY.privateKey, base64);
    await update();
  }, [update, user]);

  const dropKey = useCallback(async () => {
    localStorage.removeItem(KEY.privateKey);
    await update();
  }, [update]);



  const signOut = useCallback(async () => {
    localStorage.removeItem(KEY.token);
    localStorage.removeItem(KEY.privateKey);
    setKey(null);
    await update();
  }, [update]);




  useEffect(() => {
    void refreshToken();
  }, [token, refreshToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      void refreshToken();
    }, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshToken]);

  useEffect(() => {
    update().catch(console.error);
  }, [update]);





  const value = useMemo(() => ({
    status: getStatus(),
    error,
    clearError: () => setError(null),
    user,
    isAdmin: user ? user.scope.includes("dabih:admin") : false,
    provider,
    key,
    saveKey,
    dropKey,
    token,
    verifyToken,
    signIn,
    signOut,
    update,
  }), [
    user,
    key,
    error,
    provider,
    saveKey,
    dropKey,
    verifyToken,
    signIn,
    signOut,
    token,
    update,
    getStatus
  ]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => useContext(SessionContext);
export default useSession;

