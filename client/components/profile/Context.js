import React, {
  useEffect,
  useMemo,
  createContext,
  useContext,
} from 'react';
import { useApi } from '../api';

const ProfileContext = createContext();

export function ProfileWrapper({ children }) {
  const api = useApi();

  useEffect(() => {
  }, []);

  const contextValue = useMemo(
    () => ({
      tmp: 'Hello',
    }),
    [],
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
