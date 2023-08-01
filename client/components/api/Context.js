/* eslint-disable no-console */
import React, {
  createContext, useCallback, useContext, useMemo,
} from 'react';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';

import axios from 'axios';

const ApiContext = createContext();

export function ApiWrapper({ children }) {
  const router = useRouter();
  const { data: session } = useSession();

  const api = axios.create();
  const getHeaders = (headers) => {
    if (router && router.query && router.query.token) {
      const { token } = router.query;
      return {
        ...headers,
        Authorization: `Bearer dabih_${token}`,
      };
    }
    if (session && session.accessToken) {
      const { provider, accessToken } = session;
      return {
        ...headers,
        Authorization: `Bearer ${provider}_${accessToken}`,
      };
    }
    return headers;
  };

  const onRequest = (config) => {
    const baseUrl = config.baseUrl || '/api/v1';
    const { url, headers } = config;
    const newUrl = `${baseUrl}${url}`;

    return {
      ...config,
      headers: getHeaders(headers),
      url: newUrl,
    };
  };
  api.interceptors.request.use(onRequest, (err) => console.error(err));
  api.interceptors.response.use(
    (r) => r.data,
    (error) => {
      if (error.response.status === 401) {
        router.push('/');
        return { error: 'Unauthorized' };
      }
      const message = error.response.data || error.message;
      console.error(message);
      return { error: message };
    },
  );

  const listKeyUsers = useCallback(() => api.get('/key/list/user'), [api]);
  const generateToken = useCallback(
    async (type) => api.post(`/token/generate/${type}`),
    [api],
  );
  const removeToken = useCallback(
    async (tokenId) => api.post('/token/remove', { tokenId }),
    [api],
  );
  const listTokens = useCallback(async () => api.get('/token/list'), [api]);
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

  const admin = useMemo(() => ({
    listKeys: () => api.get('/admin/key/list'),
    confirmKey: (keyId, confirmed) => api.post('/admin/key/confirm', { keyId, confirmed }),
    deleteKey: (keyId) => api.post('/key/remove', { keyId }),
    listDatasets: () => api.get('/admin/dataset/list'),
    deleteDataset: (mnemonic) => api.post(`/dataset/${mnemonic}/remove`),
    destroyDataset: (mnemonic) => api.post(`/dataset/${mnemonic}/destroy`),
    recoverDataset: (mnemonic) => api.post(`/dataset/${mnemonic}/recover`),
    listEventDates: () => api.get('/admin/events'),
    listEvents: (date) => api.get(`/admin/events/${date}`),
  }), [api]);

  const isReady = useCallback(() => session !== undefined, [session]);

  const contextValue = useMemo(
    () => ({
      admin,
      isReady,
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
    }),
    [
      admin,
      isReady,
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
