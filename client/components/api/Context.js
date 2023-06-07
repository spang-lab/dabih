import React, {
  createContext, useCallback, useContext, useMemo,
} from 'react';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';
import createApi from './axios';

import { useMessages } from '../messages';

const ApiContext = createContext();

export function ApiWrapper({ children }) {
  const log = useMessages();
  const router = useRouter();
  const { data: session } = useSession();

  const api = useMemo(
    () => createApi({ router, onError: log.error, session }),
    [log, session, router],
  );

  // User
  const listKeyUsers = useCallback(() => api.get('/key/list/user'), [api]);
  const getUser = useCallback(async () => api.post('/token'), [api]);
  const generateToken = useCallback(
    async (type) => api.post(`/token/generate/${type}`),
    [api],
  );
  const removeToken = useCallback(
    async (tokenId) => api.post('/token/remove', { tokenId }),
    [api],
  );
  const listTokens = useCallback(async () => api.get('/token/list'), [api]);

  // Upload
  const uploadStart = useCallback(
    (name) => api.post('/upload/start', { name }),
    [api],
  );
  const uploadChunk = useCallback(
    async (chunk, mnemonic) => {
      const {
        start, end, hash, data, totalSize,
      } = chunk;
      const digest = `sha-256=${hash}`;
      const contentRange = `bytes ${start}-${end}/${totalSize}`;
      const url = `/upload/${mnemonic}`;
      const formData = new FormData();
      formData.append('chunk', data);
      const headers = {
        Digest: digest,
        'Content-Range': contentRange,
        'Content-Type': 'multipart/form-data',
      };
      return api.put(url, formData, { headers });
    },
    [api],
  );
  const uploadFinish = useCallback(
    async (mnemonic) => api.post(`/upload/finish/${mnemonic}`),
    [api],
  );

  const addPublicKey = useCallback(
    async (publicKey) => api.post('/key/add', { publicKey }),
    [api],
  );
  const checkPublicKey = useCallback(
    async (keyHash) => api.post('/key/check', { keyHash }),
    [api],
  );

  const listDatasets = useCallback(async () => api.get('/dataset/list'), [api]);
  const fetchKey = useCallback(
    async (mnemonic, keyHash) => api.post(`/dataset/${mnemonic}/key`, { keyHash }),
    [api],
  );
  const removeDataset = useCallback(
    async (mnemonic) => api.post(`/dataset/${mnemonic}/remove`),
    [api],
  );
  const renameDataset = useCallback(
    async (mnemonic, name) => api.post(`/dataset/${mnemonic}/rename`, { name }),
    [api],
  );
  const addDatasetMembers = useCallback(
    async (mnemonic, members, key) => api.post(`/dataset/${mnemonic}/member/add`, { members, key }),
    [api],
  );
  const setMemberAccess = useCallback(
    async (mnemonic, user, permission) => api.post(`/dataset/${mnemonic}/member/set`, { user, permission }),
    [api],
  );
  const reencryptDataset = useCallback(
    async (mnemonic, key) => api.post(`/dataset/${mnemonic}/reencrypt`, { key }),
    [api],
  );

  const fetchDataset = useCallback(
    async (mnemonic) => api.get(`/dataset/${mnemonic}`),
    [api],
  );
  const fetchChunk = useCallback(
    async (mnemonic, chunkId) => api.get(`/dataset/${mnemonic}/chunk/${chunkId}`, {
      responseType: 'blob',
    }),
    [api],
  );

  const isReady = useCallback(() => session !== undefined, [session]);

  const contextValue = useMemo(
    () => ({
      isReady,
      listKeyUsers,
      getUser,
      generateToken,
      removeToken,
      listTokens,
      listDatasets,
      fetchKey,
      removeDataset,
      renameDataset,
      addDatasetMembers,
      setMemberAccess,
      reencryptDataset,
      fetchDataset,
      fetchChunk,
      uploadStart,
      uploadChunk,
      uploadFinish,
      addPublicKey,
      checkPublicKey,
    }),
    [
      isReady,
      getUser,
      listKeyUsers,
      generateToken,
      removeToken,
      listTokens,
      listDatasets,
      fetchKey,
      removeDataset,
      renameDataset,
      addDatasetMembers,
      setMemberAccess,
      reencryptDataset,
      fetchDataset,
      fetchChunk,
      uploadStart,
      uploadChunk,
      uploadFinish,
      addPublicKey,
      checkPublicKey,
    ],
  );

  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
}

export const useApi = () => useContext(ApiContext);
