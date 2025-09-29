import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { UserResponse } from "./lib/api/types";

import crypto from "./lib/crypto";
import api, { setAPIToken } from "./lib/api";
import { User, UserManager, WebStorageStateStore } from "oidc-client-ts";
import { AuthProvider } from "./lib/api/types/auth";



type AuthStatus =
  "loading" |
  "unauthenticated" |
  "registered_without_key" |
  "registered_key_disabled" |
  "registered" |
  "authenticated";



interface SessionContextType {
  status: AuthStatus;
  providers: AuthProvider[];
  error: string | null;
  isAdmin: boolean;
  user: UserResponse | null;
  key: CryptoKey | null;
  token: string | null;
  clearError: () => void;
  signIn: (email: string) => Promise<void>;
  signinCallback: (providerId: string) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);


  const [providers, setProviders] = useState<AuthProvider[]>([]);
  const [managers, setManagers] = useState<Record<string, UserManager>>({});
  const [activeManager, setActiveManager] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    const { data, error } = await api.auth.providers();
    if (error) {
      console.error("Failed to fetch auth providers:", error);
      return;
    }
    if (data) {
      setProviders(data);
    }
  }, [setProviders]);


  const initManagers = useCallback(async () => {
    const userStore = new WebStorageStateStore({ store: window.localStorage });
    const newManagers: Record<string, UserManager> = {};
    providers.forEach(provider => {
      const redirectUri = `${window.location.origin}/callback/${provider.id}`;
      const manager = new UserManager({
        authority: provider.authority,
        client_id: provider.clientId,
        scope: provider.scopes.join(" "),
        redirect_uri: redirectUri,
        post_logout_redirect_uri: window.location.origin,
        response_type: "code",
        userStore,
        metadata: provider.metadata,
      });
      newManagers[provider.id] = manager;
    });
    setManagers(newManagers);
  }, [setManagers, providers]);



  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  useEffect(() => {
    if (providers.length > 0) {
      initManagers();
    }
  }, [providers, initManagers]);

  useEffect(() => {
    const ids = Object.keys(managers);
    ids.forEach(id => {
      const manager = managers[id];
      manager.getUser().then(user => {
        if (user) {
          setUser(user);
          setActiveManager(id);
        }
      });
      const onUserLoaded = (u: User) => {
        setUser(u);
        setActiveManager(id);
      };
      const onUserUnloaded = () => {
        setUser(null);
        setActiveManager(null);
      };
      manager.events.addUserLoaded(onUserLoaded);
      manager.events.addUserUnloaded(onUserUnloaded);
      return () => {
        manager.events.removeUserLoaded(onUserLoaded);
        manager.events.removeUserUnloaded(onUserUnloaded);
      };
    });
  }, [managers]);


  const signIn = useCallback(async (providerId: string) => {
    const manager = managers[providerId];
    if (!manager) {
      setError("Invalid auth provider");
      return;
    }
    try {
      setActiveManager(providerId);
      await manager.signinRedirect();
    } catch (e) {
      console.error("Sign-in error:", e);
      setError("Failed to initiate sign-in");
    }
  }, [managers]);

  const signOut = useCallback(async () => {
    if (!activeManager) {
      console.warn("No active auth manager for sign-out");
      return;
    }
    const manager = managers[activeManager];
    if (!manager) {
      console.error("Active auth manager not found");
      return;
    }
    try {
      await manager.signoutRedirect();
      setUser(null);
      setToken(null);
      setKey(null);
      setAPIToken(null);
    } catch (e) {
      console.error("Sign-out error:", e);
      setError("Failed to sign out");
    }
  }, [activeManager, managers]);

  const signinCallback = useCallback(async (providerId) => {
    const manager = managers[providerId];
    if (!manager) {
      return
    };
    await manager.signinCallback();

  }, [managers]);


  const update = () => { };

  const saveKey = useCallback(async (privateKey: CryptoKey) => {
    setKey(privateKey);
  }, []);
  const dropKey = useCallback(async () => {
    setKey(null);
  }, []);



  const value = useMemo(() => ({
    status: () => "loading",
    providers,
    error,
    clearError: () => setError(null),
    user,
    isAdmin: user ? user.scopes.includes("dabih:admin") : false,
    key,
    saveKey,
    dropKey,
    token,
    signIn,
    signinCallback,
    signOut,
    update,
  }), [
    user,
    providers,
    key,
    error,
    saveKey,
    dropKey,
    signIn,
    signinCallback,
    signOut,
    token,
    update,
  ]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

const useSession = () => useContext(SessionContext);
export default useSession;

