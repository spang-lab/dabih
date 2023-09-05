'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from 'react';
import pLimit from 'p-limit';
import { useRouter } from 'next/navigation';
import useDialog from '../dialog';
import {
  storage,
  decryptKey,
  encodeHash,
  decryptChunk,
  exportAesKey,
} from '../../lib';
import { useApi } from '../api';

const DatasetContext = createContext();

export function DatasetsWrapper({ children }) {
  const api = useApi();
  const dialog = useDialog();
  const router = useRouter();

  const limit = 25;

  const [datasets, setDatasets] = useState([]);
  const [datasetCount, setDatasetCount] = useState(0);
  const [searchParams, setSearchParams] = useState({
    deleted: false,
    all: false,
    page: 1,
    limit: 25,
  });

  const fetchDatasets = useCallback(async () => {
    if (!api.isReady()) {
      return;
    }
    const data = await api.searchDatasets(searchParams);
    if (data.error) {
      return;
    }
    setDatasets(data.datasets);
    setDatasetCount(data.count);
  }, [api, searchParams]);

  const removeDataset = useCallback(
    async (mnemonic) => {
      if (api.isAdmin()) {
        await api.admin.removeDataset(mnemonic);
      } else {
        await api.removeDataset(mnemonic);
      }
      await fetchDatasets();
    },
    [api, fetchDatasets],
  );
  const destroyDataset = useCallback(
    async (mnemonic) => {
      await api.admin.destroyDataset(mnemonic);
      await fetchDatasets();
    },
    [api, fetchDatasets],
  );
  const recoverDataset = useCallback(
    async (mnemonic) => {
      await api.admin.recoverDataset(mnemonic);
      await fetchDatasets();
    },
    [api, fetchDatasets],
  );

  const addMembers = useCallback(
    async (mnemonic, members) => {
      const keys = await storage.readKey();
      const key = await api.fetchKey(mnemonic, keys.hash);
      const aesKey = await decryptKey(keys.privateKey, key);
      const base64 = await exportAesKey(aesKey);

      await api.addDatasetMembers(mnemonic, members, base64);
      await fetchDatasets();
    },
    [api, fetchDatasets],
  );

  const reencryptDataset = useCallback(
    async (mnemonic) => {
      const keys = await storage.readKey();
      const key = await api.fetchKey(mnemonic, keys.hash);
      const aesKey = await decryptKey(keys.privateKey, key);
      const base64 = await exportAesKey(aesKey);

      await api.reencryptDataset(mnemonic, base64);
    },
    [api],
  );

  const renameDataset = useCallback(
    async (mnemonic, name) => {
      await api.renameDataset(mnemonic, name);
      await fetchDatasets();
    },
    [api, fetchDatasets],
  );

  const setAccess = useCallback(
    async (mnemonic, user, permission) => {
      await api.setMemberAccess(mnemonic, user, permission);
      await fetchDatasets();
    },
    [api, fetchDatasets],
  );

  const downloadChunks = useCallback(
    async (mnemonic, chunks, aesKey, parallel = 1) => {
      const plimit = pLimit(parallel);
      const handleChunk = async (chunk) => {
        const { iv, data } = chunk;
        if (data) return chunk;
        const hash = encodeHash(chunk.hash);
        const encrypted = await api.fetchChunk(mnemonic, hash);
        if (encrypted.error) {
          return chunk;
        }
        const decrypted = await decryptChunk(aesKey, iv, encrypted);
        return {
          ...chunk,
          data: new Blob([decrypted]),
        };
      };
      const promises = chunks.map(async (chunk) => plimit(() => handleChunk(chunk)));
      return Promise.all(promises);
    },
    [api],
  );

  const areChunksComplete = (chunks) => {
    const n = chunks.length;
    let prevEnd = 0;
    for (let i = 0; i < n; i += 1) {
      const chunk = chunks[i];
      if (!chunk.data) {
        return false;
      }
      if (chunk.start !== prevEnd) {
        return false;
      }
      prevEnd = chunk.end;
      if (i === n - 1) {
        return chunk.end === chunk.size;
      }
    }
    return false;
  };

  const downloadDataset = useCallback(
    async (mnemonic) => {
      const keys = await storage.readKey();
      const key = await api.fetchKey(mnemonic, keys.hash);
      if (!key || key.error) {
        dialog.error(key.error);
        return null;
      }
      const { fileName, chunks } = await api.fetchDataset(mnemonic);
      const aesKey = await decryptKey(keys.privateKey, key);

      let dataChunks = await downloadChunks(mnemonic, chunks, aesKey, 5);
      // Retry any failed downloads
      dataChunks = await downloadChunks(mnemonic, dataChunks, aesKey, 1);

      if (!areChunksComplete(dataChunks)) {
        return null;
      }
      const blobs = dataChunks.map((c) => c.data);
      return {
        file: new Blob(blobs),
        name: fileName,
      };
    },
    [api, downloadChunks, dialog],
  );

  const downloadDecryptedDataset = useCallback(
    async (mnemonic) => {
      const keys = await storage.readKey();
      const key = await api.fetchKey(mnemonic, keys.hash);
      if (!key || key.error) {
        dialog.error(key.error);
        return;
      }
      const aesKey = await decryptKey(keys.privateKey, key);
      const encoded = await exportAesKey(aesKey);
      const { token, error } = await api.storeKey(mnemonic, encoded);
      if (!error) {
        const url = `/api/v1/dataset/${mnemonic}/download/?token=${token}`;
        router.push(url);
      }
    },
    [api, dialog, router],
  );

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  const contextValue = useMemo(
    () => ({
      datasets,
      limit,
      datasetCount,
      searchParams,
      setSearchParams,
      removeDataset,
      destroyDataset,
      recoverDataset,
      downloadDataset,
      downloadDecryptedDataset,
      reencryptDataset,
      renameDataset,
      addMembers,
      setAccess,
    }),
    [
      datasets,
      searchParams,
      datasetCount,
      setSearchParams,
      removeDataset,
      recoverDataset,
      destroyDataset,
      downloadDataset,
      downloadDecryptedDataset,
      renameDataset,
      reencryptDataset,
      addMembers,
      setAccess,
    ],
  );

  return (
    <DatasetContext.Provider value={contextValue}>
      {children}
    </DatasetContext.Provider>
  );
}

export const useDatasets = () => useContext(DatasetContext);
