'use client';

import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react';
import api from '@/lib/api';
import { useUser } from '@/lib/hooks';

const ProfileContext = createContext();

export function ProfileWrapper({ children }) {
  const [publicKeys, setPublicKeys] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [token, setToken] = useState(null);
  const user = useUser();

  const fetchKeys = useCallback(async () => {
    const data = await api.key.list();
    if (data.error) {
      return;
    }
    setPublicKeys(data);
  }, []);

  const fetchTokens = useCallback(async () => {
    const result = await api.token.list();
    if (result.error) {
      return;
    }
    setTokens(result);
  }, []);

  const enableKey = useCallback(
    async (keyId, enabled) => {
      await api.key.enable(keyId, enabled);
      await fetchKeys();
    },
    [fetchKeys],
  );

  const addRootKey = useCallback(
    async (publicKey) => {
      const { name, email } = user;
      await api.key.add({
        key: publicKey,
        name,
        email,
        isRootKey: true,
      });
      await fetchKeys();
    },
    [user, fetchKeys],
  );

  const deleteKey = useCallback(
    async (keyId) => {
      await api.key.remove(keyId);
      await fetchKeys();
    },
    [fetchKeys],
  );

  const generateToken = useCallback(
    async (scopes) => {
      const result = await api.token.generate(scopes);
      if (result.error) {
        return;
      }
      setToken(result);
      fetchTokens();
    },
    [setToken, fetchTokens],
  );

  const removeToken = useCallback(
    async (t) => {
      await api.token.remove(t);
      await fetchTokens();
    },
    [fetchTokens],
  );
  const clearToken = useCallback(() => setToken(null), [setToken]);

  useEffect(() => {
    if (user.status !== 'authenticated') {
      return;
    }
    fetchTokens();
    fetchKeys();
  }, [user.status, fetchTokens, fetchKeys]);

  const contextValue = useMemo(
    () => ({
      token,
      tokens,
      enableKey,
      addRootKey,
      deleteKey,
      publicKeys,
      generateToken,
      removeToken,
      clearToken,
    }),
    [
      generateToken,
      enableKey,
      addRootKey,
      deleteKey,
      publicKeys,
      token,
      removeToken,
      tokens,
      clearToken,
    ],
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
