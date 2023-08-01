import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
} from 'react';
import { useApi } from '../api';

const ProfileContext = createContext();

export function ProfileWrapper({ children }) {
  const api = useApi();
  const [tokens, setTokens] = useState([]);
  const [token, setToken] = useState(null);

  const fetchTokens = useCallback(async () => {
    if (!api.isReady()) {
      return;
    }
    const result = await api.listTokens();
    if (result.error) {
      return;
    }
    setTokens(result);
  }, [api]);

  useEffect(() => {
    fetchTokens();
  }, [fetchTokens, token]);

  const generateToken = useCallback(
    async (type) => {
      const result = await api.generateToken(type);
      if (result.error) {
        return;
      }
      setToken(result);
    },
    [api, setToken],
  );

  const removeToken = useCallback(
    async (t) => {
      await api.removeToken(t);
      await fetchTokens();
    },
    [api, fetchTokens],
  );
  const clearToken = useCallback(() => setToken(null), [setToken]);

  const contextValue = useMemo(
    () => ({
      token,
      tokens,
      generateToken,
      removeToken,
      clearToken,
    }),
    [generateToken, token, removeToken, tokens, clearToken],
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);
