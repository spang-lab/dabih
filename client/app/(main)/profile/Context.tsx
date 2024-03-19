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

interface ProfileContextType {
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileWrapper({ children }) {
  const [publicKeys, setPublicKeys] = useState([]);
  const user = useUser();

  const fetchKeys = useCallback(async () => {
    const data = await api.key.list();
    if (data.error) {
      return;
    }
    setPublicKeys(data);
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

  const removeKey = useCallback(
    async (keyId) => {
      await api.key.remove(keyId);
      await fetchKeys();
    },
    [fetchKeys],
  );

  useEffect(() => {
    if (user.status !== 'authenticated') {
      return;
    }
    fetchKeys();
  }, [user.status, fetchKeys]);

  const contextValue = useMemo(
    () => ({
      enableKey,
      addRootKey,
      removeKey,
      publicKeys,
    }),
    [
      enableKey,
      addRootKey,
      removeKey,
      publicKeys,
      fetchKeys,
    ],
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
