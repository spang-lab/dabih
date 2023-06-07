import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from 'react';
import pLimit from 'p-limit';
import { useRouter } from 'next/router';
import {
  storage, decryptKey, encodeHash, decryptChunk,
} from '../../lib';
import { useApi } from '../api';
import { useMessages } from '../messages';

const DownloadContext = createContext();

export function DownloadWrapper({ children }) {
  const router = useRouter();
  const log = useMessages();
  const { mnemonic } = router.query;
  const api = useApi();
  const [chunkCount, setChunkCount] = useState({ total: 0, current: 0 });
  const [dataset, setDataset] = useState(null);
  const [file, setFile] = useState(null);

  const downloadDataset = useCallback(async () => {
    if (!api.isReady() || !mnemonic) {
      return;
    }
    const keys = await storage.readKey();
    const info = await api.fetchDataset(mnemonic);
    setDataset(info);
    const key = await api.fetchKey(mnemonic, keys.hash);

    const aesKey = await decryptKey(keys.privateKey, key);

    let limit = pLimit(5);
    const handleChunk = async (chunk) => {
      const { iv, data, hash } = chunk;
      if (data) return chunk;
      const hashurl = encodeHash(hash);
      const encrypted = await api.fetchChunk(mnemonic, hashurl);
      if (encrypted.error) {
        return chunk;
      }
      const decrypted = await decryptChunk(aesKey, iv, encrypted);
      setChunkCount({
        total: info.chunks.length,
        current: info.chunks.length - limit.pendingCount,
      });
      return {
        ...chunk,
        data: new Blob([decrypted]),
      };
    };
    let promises = info.chunks
      .sort((c1, c2) => c1.start - c2.start)
      .map(async (chunk) => limit(() => handleChunk(chunk)));
    let dataChunks = await Promise.all(promises);
    limit = pLimit(1);
    promises = dataChunks.map(async (chunk) => limit(() => handleChunk(chunk)));
    dataChunks = await Promise.all(promises);

    const result = dataChunks.reduce((acc, chunk) => {
      const { prevChunk, errors } = acc;
      const { hash, data } = chunk;
      if (!data) {
        return {
          prevChunk: chunk,
          errors: [...errors, `Chunk ${hash} was not downloaded successfully`],
        };
      }
      if (!prevChunk) {
        return {
          prevChunk: chunk,
          errors: [],
        };
      }
      if (chunk.start !== prevChunk.end) {
        return {
          prevChunk: chunk,
          errors: [...errors, `Error in chunk order for chunk ${hash}`],
        };
      }
      return {
        prevChunk: chunk,
        errors,
      };
    }, {});
    const { errors } = result;
    const lastChunk = result.prevChunk;
    if (lastChunk.size !== lastChunk.end) {
      errors.push('Chunks incomplete');
    }
    if (errors.length) {
      errors.forEach((e) => log.error(e));
      return;
    }
    setFile({
      data: new Blob(dataChunks.map((c) => c.data)),
      name: info.fileName,
    });
  }, [api, mnemonic, log]);

  useEffect(() => {
    downloadDataset();
  }, [downloadDataset]);

  const contextValue = useMemo(
    () => ({
      dataset,
      file,
      chunks: chunkCount,
      downloadDataset,
    }),
    [dataset, file, chunkCount, downloadDataset],
  );

  return (
    <DownloadContext.Provider value={contextValue}>
      {children}
    </DownloadContext.Provider>
  );
}

export const useDownload = () => useContext(DownloadContext);
