'use client';

import { useEffect, useState } from 'react';
import useSession from '@/app/session';
import api from '../api';
import crypto from '../crypto';

type Chunk = {
  iv: string
  hash: string,
  data?: Blob
  start: number
  end: number
  size: number
};

type Dataset = {
  fileName: string,
  chunks: Chunk[],
  hash: string,
  size: number,
};

type DownloadState = {
  mnemonic: string,
  aesKey?: CryptoKey,
  dataset?: Dataset,
  downloaded?: Chunk[],
  error?: string,
  stream?: FileSystemWritableFileStream,
  file?: Blob,
};

type DownloadStatus = {
  state: 'ready' | 'preparing' | 'downloading' | 'complete' | 'error',
  error?: string,
  file?: Blob,
  fileName?: string,
  current?: number,
  total?: number,
};

export default function useDownload() {
  const { key } = useSession();
  const [state, setState] = useState<DownloadState | null>(null);
  const [isStopped, setStopped] = useState<boolean>(false);

  const getStatus = (): DownloadStatus => {
    if (!state || isStopped) {
      return {
        state: 'ready',
      };
    }
    if (state.error) {
      return {
        state: 'error',
        error: state.error,
      };
    }
    if (state.file && state.dataset) {
      return {
        state: 'complete',
        file: state.file!,
        fileName: state.dataset.fileName,
      };
    }
    if (state.dataset && state.downloaded && (!('showSaveFilePicker' in window) || state.stream)) {
      const chunk = state.downloaded.at(-1);
      return {
        state: 'downloading',
        current: chunk?.end || 0,
        total: state.dataset.size,
        fileName: state.dataset.fileName,
      };
    }
    return {
      state: 'preparing',
    };
  };

  useEffect(() => {
    if (!state || !key || state.error || state.file || isStopped) {
      return;
    }
    (async () => {
      const { mnemonic } = state;

      // Fetch and decrypt the AES Key
      if (!state.aesKey) {
        const keyHash = await crypto.privateKey.toHash(key);
        const result = await api.dataset.key(mnemonic, keyHash);
        if (result.error) {
          setState({
            ...state,
            error: result.error,
          });
          return;
        }
        const buffer = await crypto.privateKey.decryptAesKey(key, result.key);
        const aesKey = await crypto.aesKey.fromUint8(buffer);
        setState({
          ...state,
          aesKey,
        });
        return;
      }
      // Fetch the dataset information
      if (!state.dataset || !state.downloaded) {
        const dataset = await api.dataset.get(mnemonic);
        if (dataset.error) {
          setState({
            ...state,
            error: dataset.error,
          });
        }
        setState({
          ...state,
          dataset,
          downloaded: [],
        });
        return;
      }
      const { dataset, downloaded, aesKey } = state;

      const hasStreamAPI = 'showSaveFilePicker' in window;
      if (hasStreamAPI && !state.stream) {
        try {
          // @ts-ignore
          const handle = await window.showSaveFilePicker({
            suggestedName: dataset.fileName,
          });
          if (!handle) {
            setState(null);
            return;
          }
          const stream = await handle.createWritable();
          setState({
            ...state,
            stream,
          });
        } catch (err: any) {
          setState({
            ...state,
            error: err.toString(),
          });
        }
        return;
      }
      const chunk = dataset.chunks.find((_c, i) => !downloaded[i]);
      // Download the next chunk
      if (chunk) {
        const { iv, hash } = chunk;
        const encrypted = await api.dataset.chunk(mnemonic, hash);
        if (encrypted.error) {
          setState({
            ...state,
            error: encrypted.error,
          });
          return;
        }
        const buffer = await encrypted.arrayBuffer();
        const decrypted = await crypto.aesKey.decrypt(aesKey, iv, buffer);
        const { stream } = state;
        const downloadedChunk = {
          ...chunk,
        };
        if (stream) {
          await stream.write(decrypted);
        } else {
          downloadedChunk.data = new Blob([decrypted]);
        }
        setState({
          ...state,
          downloaded: [...state.downloaded, downloadedChunk],
        });
        return;
      }
      // Finish the download
      const { stream } = state;
      if (stream) {
        await stream.close();
        setState(null);
      } else {
        const blobs = downloaded.map((c) => c.data!);
        const file = new Blob(blobs);
        setState({
          ...state,
          file,
        });
      }
    })();
  }, [isStopped, state, key]);

  return {
    start: (mnemonic: string) => {
      setStopped(false);
      setState({ mnemonic });
    },
    cancel: () => setStopped(true),
    ...getStatus(),
  };
}
