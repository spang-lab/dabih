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
  hasApi: boolean;
  user: UserResponse | null;
  key: CryptoKey | null;
  token: string | null;
  provider: OpenIDProvider | null;
  clearError: () => void;
  signIn: (email: string) => Promise<void>;
  verifyToken: (token: string) => Promise<void>;
  refreshToken: (lifetimeS?: number) => Promise<void>;
  signOut: () => Promise<void>;
  saveToken: (token: string) => Promise<void>;
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

  const saveToken = useCallback(async (newToken: string) => {
    localStorage.setItem(KEY.token, newToken);
    await update();
  }, [update]);



  const signIn = useCallback(async (email: string) => {
    const { data, error } = await api.auth.signIn(email);
    if (error || !data) {
      setError(`Sign in failed with error`);
      return;
    }
    const { status, token } = data;
    if (status === "success" && token) {
      await verifyToken(token);
    }
  }, [verifyToken]);



  const refreshToken = useCallback(async (lifetimeS?: number) => {
    if (!token || !key) {
      return;
    }
    const payload = crypto.jwt.decode(token);
    const { exp, sub } = payload;
    if (!exp) {
      console.error("Invalid token payload:", payload);
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    if (lifetimeS && exp - now > lifetimeS) {
      // Token is still valid no need to refresh
      return;
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
    const fifteenMinutes = 15 * 60;
    refreshToken(fifteenMinutes).catch(console.error);
    const interval = setInterval(() => {
      refreshToken(fifteenMinutes).catch(console.error);
    }, fifteenMinutes * 1000);
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
    hasApi: user ? user.scope.includes("dabih:api") : false,
    provider,
    key,
    saveToken,
    refreshToken,
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
    saveToken,
    refreshToken,
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

