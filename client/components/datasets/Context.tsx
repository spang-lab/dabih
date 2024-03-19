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
import crypto from '@/lib/crypto';
import { useKey, useUser } from '@/lib/hooks';
import api from '@/lib/api';
import useDialog from '../dialog';

const DatasetContext = createContext(null);

export function DatasetsWrapper({ children }) {
  const key = useKey();
  const user = useUser();
  const dialog = useDialog();
  const router = useRouter();

  const limit = 25;

  const [datasets, setDatasets] = useState<any[]>([]);
  const [orphans, setOrphans] = useState<any[]>([]);
  const [datasetCount, setDatasetCount] = useState(0);
  const [searchParams, setSearchParams] = useState({
    deleted: false,
    all: false,
    page: 1,
    limit: 25,
  });

  const getAesKey = useCallback(async (mnemonic: string) => {
    if (!key) {
      return null;
    }
    const keyHash = await crypto.privateKey.toHash(key);
    const result = await api.dataset.key(mnemonic, keyHash);
    if (result.error) {
      dialog.error(result.error);
      return null;
    }
    const aesBuffer = await crypto.privateKey.decryptAesKey(key, result.key);
    return crypto.aesKey.fromUint8(aesBuffer);
  }, [dialog, key]);

  const fetchDatasets = useCallback(async () => {
    const data = await api.dataset.search(searchParams);
    if (data.error) {
      return;
    }
    setDatasets(data.datasets);
    setDatasetCount(data.count);
    if (user.isAdmin) {
      const orph = await api.dataset.listOrphans();
      setOrphans(orph);
    }
  }, [user.isAdmin, searchParams]);

  const removeDataset = useCallback(
    async (mnemonic: string) => {
      await api.dataset.remove(mnemonic);
      await fetchDatasets();
    },
    [fetchDatasets],
  );
  const destroyDataset = useCallback(
    async (mnemonic: string) => {
      await api.dataset.destroy(mnemonic);
      await fetchDatasets();
    },
    [fetchDatasets],
  );
  const recoverDataset = useCallback(
    async (mnemonic) => {
      await api.dataset.recover(mnemonic);
      await fetchDatasets();
    },
    [fetchDatasets],
  );

  const addMember = useCallback(
    async (mnemonic: string, member: string) => {
      const aesKey = await getAesKey(mnemonic);
      if (!aesKey) {
        return;
      }
      const base64 = await crypto.aesKey.toBase64(aesKey!);
      await api.dataset.addMember(mnemonic, member, base64);
      await fetchDatasets();
    },
    [getAesKey, fetchDatasets],
  );

  const reencryptDataset = useCallback(
    async (mnemonic: string) => {
      const aesKey = await getAesKey(mnemonic);
      if (!aesKey) {
        return;
      }
      const base64 = await crypto.aesKey.toBase64(aesKey);
      await api.dataset.reencrypt(mnemonic, base64);
    },
    [getAesKey],
  );

  const renameDataset = useCallback(
    async (mnemonic: string, name: string) => {
      await api.dataset.rename(mnemonic, name);
      await fetchDatasets();
    },
    [fetchDatasets],
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
        const { iv, data, hash } = chunk;
        if (data) return chunk;
        const encrypted = await api.fetchChunk(mnemonic, hash);
        if (encrypted.error) {
          return chunk;
        }
        const buffer = await data.arrayBuffer();
        const decrypted = await crypto.aesKey.decrypt(aesKey, iv, buffer);
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
      const aesKey = await getAesKey();
      const { fileName, chunks } = await api.fetchDataset(mnemonic);

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
    [api, getAesKey, downloadChunks],
  );

  const downloadDecryptedDataset = useCallback(
    async (mnemonic) => {
      const aesKey = await getAesKey();
      const base64 = await crypto.aesKey.toBase64(aesKey);
      const { token, error } = await api.storeKey(mnemonic, base64);
      if (!error) {
        const url = `/api/v1/dataset/${mnemonic}/download/?token=${token}`;
        router.push(url);
      }
    },
    [api, getAesKey, router],
  );

  useEffect(() => {
    fetchDatasets();
    fetchOrphans();
  }, [fetchDatasets, fetchOrphans]);

  const contextValue = useMemo(
    () => ({
      datasets,
      orphans,
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
      orphans,
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
