import React, {
  useEffect, useState, useCallback, useMemo, createContext, useContext,
} from 'react';
import pLimit from 'p-limit';
import {
  storage, decryptKey, encodeHash, decryptChunk, exportAesKey,
} from '../../lib';
import { useApi } from '../api';

const DatasetContext = createContext();

export function DatasetsWrapper({ children }) {
  const api = useApi();
  const [datasets, setDatasets] = useState([]);

  const fetchDatasets = useCallback(async () => {
    if (!api.isReady()) {
      return;
    }
    const data = await api.listDatasets();
    if (data.error) {
      return;
    }
    setDatasets(data);
  }, [api]);

  const removeDataset = useCallback(async (mnemonic) => {
    await api.removeDataset(mnemonic);
    await fetchDatasets();
  }, [api, fetchDatasets]);

  const addMembers = useCallback(async (mnemonic, members) => {
    const keys = await storage.readKey();
    const key = await api.fetchKey(mnemonic, keys.hash);
    const aesKey = await decryptKey(keys.privateKey, key);
    const base64 = await exportAesKey(aesKey);

    await api.addDatasetMembers(mnemonic, members, base64);
    await fetchDatasets();
  }, [api, fetchDatasets]);

  const reencryptDataset = useCallback(async (mnemonic) => {
    const keys = await storage.readKey();
    const key = await api.fetchKey(mnemonic, keys.hash);
    const aesKey = await decryptKey(keys.privateKey, key);
    const base64 = await exportAesKey(aesKey);

    await api.reencryptDataset(mnemonic, base64);
  }, [api]);

  const renameDataset = useCallback(async (mnemonic, name) => {
    await api.renameDataset(mnemonic, name);
    await fetchDatasets();
  }, [api, fetchDatasets]);

  const setAccess = useCallback(async (mnemonic, user, permission) => {
    await api.setMemberAccess(mnemonic, user, permission);
    await fetchDatasets();
  }, [api, fetchDatasets]);

  const downloadChunks = useCallback(async (mnemonic, chunks, aesKey, parallel = 1) => {
    const limit = pLimit(parallel);
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
    const promises = chunks.map(async (chunk) => limit(() => handleChunk(chunk)));
    return Promise.all(promises);
  }, [api]);

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

  const downloadDataset = useCallback(async (mnemonic) => {
    const keys = await storage.readKey();
    const key = await api.fetchKey(mnemonic, keys.hash);
    if (!key || key.error) {
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
  }, [api, downloadChunks]);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);

  const contextValue = useMemo(() => ({
    datasets,
    removeDataset,
    downloadDataset,
    reencryptDataset,
    renameDataset,
    addMembers,
    setAccess,
  }), [
    datasets,
    removeDataset,
    downloadDataset,
    renameDataset,
    reencryptDataset,
    addMembers,
    setAccess,
  ]);

  return (
    <DatasetContext.Provider value={contextValue}>
      {children}
    </DatasetContext.Provider>
  );
}

export const useDatasets = () => useContext(DatasetContext);
