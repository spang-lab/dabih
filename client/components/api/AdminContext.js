import React, {
  createContext, useCallback, useContext, useMemo,
} from 'react';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import createApi from './axios';

import { useMessages } from '../messages';

const AdminApiContext = createContext();

export function AdminApiWrapper({ children }) {
  const log = useMessages();
  const { data: session } = useSession();
  const router = useRouter();

  const api = useMemo(
    () => createApi({ router, onError: log.error, session }),
    [log, session, router],
  );

  // User
  const isAdmin = useCallback(() => api.get('/admin'), [api]);
  const listKeys = useCallback(() => api.get('/admin/key/list'), [api]);
  const confirmKey = useCallback(
    (keyId, confirmed) => api.post('/admin/key/confirm', { keyId, confirmed }),
    [api],
  );
  const deleteKey = useCallback(
    (keyId) => api.post('/admin/key/remove', { keyId }),
    [api],
  );
  const listDatasets = useCallback(() => api.get('/admin/dataset/list'), [api]);
  const deleteDataset = useCallback(
    (mnemonic) => api.post(`/admin/dataset/${mnemonic}/remove`),
    [api],
  );
  const destroyDataset = useCallback(
    (mnemonic) => api.post(`/admin/dataset/${mnemonic}/destroy`),
    [api],
  );
  const recoverDataset = useCallback(
    (mnemonic) => api.post(`/admin/dataset/${mnemonic}/recover`),
    [api],
  );

  const listEventDates = useCallback(() => api.get('/admin/events'), [api]);
  const listEvents = useCallback(
    (date) => api.get(`/admin/events/${date}`),
    [api],
  );

  const isReady = useCallback(() => session !== undefined, [session]);

  const contextValue = useMemo(
    () => ({
      isReady,
      isAdmin,
      listKeys,
      confirmKey,
      deleteKey,
      listDatasets,
      deleteDataset,
      destroyDataset,
      recoverDataset,
      listEventDates,
      listEvents,
    }),
    [
      isReady,
      isAdmin,
      listKeys,
      confirmKey,
      deleteKey,
      listDatasets,
      deleteDataset,
      destroyDataset,
      recoverDataset,
      listEventDates,
      listEvents,
    ],
  );

  return (
    <AdminApiContext.Provider value={contextValue}>
      {children}
    </AdminApiContext.Provider>
  );
}

export const useAdminApi = () => useContext(AdminApiContext);
