'use client';

/* eslint-disable no-console */
import React, { createContext, useContext, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { useSession } from 'next-auth/react';

import axios from 'axios';

const ApiContext = createContext();

export function ApiWrapper({ children }) {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();

  const api = axios.create();
  const getHeaders = (headers) => {
    if (params && params.token) {
      const { token } = params;
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
      if (error.response?.status === 401) {
        router.push('/logout');
        return { error: 'Unauthorized' };
      }
      const message = error.response?.data || error.message;
      console.error(message);
      return { error: message };
    },
  );

  const admin = useMemo(
    () => ({
      listKeys: () => api.get('/admin/key/list'),
      confirmKey: (keyId, confirmed) => api.post('/admin/key/confirm', { keyId, confirmed }),
      listDatasets: () => api.get('/admin/dataset/list'),
      removeDataset: (mnemonic) => api.post(`/admin/dataset/${mnemonic}/remove`),
      destroyDataset: (mnemonic) => api.post(`/admin/dataset/${mnemonic}/destroy`),
      recoverDataset: (mnemonic) => api.post(`/admin/dataset/${mnemonic}/recover`),
      listEventDates: () => api.get('/admin/events'),
      listEvents: (date) => api.get(`/admin/events/${date}`),
    }),
    [api],
  );

  const contextValue = useMemo(
    () => ({
      admin,
      isReady: () => session && session.user,
      isAdmin: () => {
        if (!session || !session.user) {
          return false;
        }
        return session.user.scopes.includes('admin');
      },
      listKeyUsers: () => api.get('/key/list/user'),
      getUser: async () => api.post('/token'),
      generateToken: async (type) => api.post(`/token/generate/${type}`),
      removeToken: async (tokenId) => api.post('/token/remove', { tokenId }),
      listTokens: async () => api.get('/token/list'),
      uploadCheck: async () => api.get('/upload/check'),
      uploadStart: (fileName, size, chunkHash, name) => api.post('/upload/start', {
        fileName, size, chunkHash, name,
      }),
      uploadChunk: async (chunk, mnemonic) => {
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
      uploadFinish: async (mnemonic) => api.post(`/upload/finish/${mnemonic}`),
      uploadCancel: async (mnemonic) => api.post(`/upload/cancel/${mnemonic}`),
      addPublicKey: async (publicKey) => api.post('/key/add', { publicKey }),
      checkPublicKey: async (keyHash) => api.post('/key/check', { keyHash }),
      removePublicKey: async (keyId) => api.post('/key/remove', { keyId }),
      searchDatasets: async (data) => api.post('/dataset/search', data),
      fetchKey: async (mnemonic, keyHash) => api.post(`/dataset/${mnemonic}/key`, { keyHash }),
      removeDataset: async (mnemonic) => api.post(`/dataset/${mnemonic}/remove`),
      renameDataset: async (mnemonic, name) => api.post(`/dataset/${mnemonic}/rename`, { name }),
      storeKey: async (mnemonic, key) => api.post(`/dataset/${mnemonic}/download`, { key }),
      addDatasetMembers: async (mnemonic, members, key) => api.post(`/dataset/${mnemonic}/member/add`, { members, key }),
      setMemberAccess: async (mnemonic, user, permission) => api.post(`/dataset/${mnemonic}/member/set`, { user, permission }),
      reencryptDataset: async (mnemonic, key) => api.post(`/dataset/${mnemonic}/reencrypt`, { key }),
      fetchDataset: async (mnemonic) => api.get(`/dataset/${mnemonic}`),
      fetchChunk: async (mnemonic, chunkId) => api.get(`/dataset/${mnemonic}/chunk/${chunkId}`, {
        responseType: 'blob',
      }),
    }),
    [api, session, admin],
  );

  return (
    <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
  );
}

export const useApi = () => useContext(ApiContext);
