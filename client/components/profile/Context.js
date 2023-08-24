'use client';

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

  const [publicKeys, setPublicKeys] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [token, setToken] = useState(null);
  const [eventDates, setEventDates] = useState([]);
  const [selectedDate, setDate] = useState(null);
  const [events, setEvents] = useState([]);

  const fetchEvents = useCallback(async () => {
    if (!selectedDate || !api.isAdmin()) {
      return;
    }
    const data = await api.admin.listEvents(selectedDate);
    if (data.error) {
      return;
    }
    setEvents(data);
  }, [api, selectedDate]);

  const fetchEventDates = useCallback(async () => {
    if (!api.isAdmin()) {
      return;
    }
    const data = await api.admin.listEventDates();
    if (data.error) {
      return;
    }
    setEventDates(data);
    setDate(data[0]);
  }, [api]);

  const fetchKeys = useCallback(async () => {
    if (!api.isAdmin()) {
      return;
    }
    const data = await api.admin.listKeys();
    if (data.error) {
      return;
    }
    setPublicKeys(data);
  }, [api]);

  const confirmKey = useCallback(
    async (keyId, confirmed) => {
      await api.admin.confirmKey(keyId, confirmed);
      await fetchKeys();
    },
    [api, fetchKeys],
  );

  const deleteKey = useCallback(
    async (keyId) => {
      await api.admin.deleteKey(keyId);
      await fetchKeys();
    },
    [api, fetchKeys],
  );

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
    fetchKeys();
    fetchEventDates();
  }, [fetchTokens, fetchKeys, fetchEventDates]);

  useEffect(() => {
    fetchEvents();
  }, [selectedDate, fetchEvents]);

  const generateToken = useCallback(
    async (type) => {
      const result = await api.generateToken(type);
      if (result.error) {
        return;
      }
      setToken(result);
      fetchTokens();
    },
    [api, setToken, fetchTokens],
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
      confirmKey,
      deleteKey,
      publicKeys,
      events,
      eventDates,
      fetchEvents,
      selectedDate,
      setDate,
      generateToken,
      removeToken,
      clearToken,
    }),
    [
      generateToken,
      confirmKey,
      deleteKey,
      publicKeys,
      selectedDate,
      eventDates,
      events,
      fetchEvents,
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
