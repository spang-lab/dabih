'use client';

import { useEffect, useState } from 'react';
import useSession from '@/app/session';
import api from '../api';
import crypto from '../crypto';

type Dataset = {
  mnemonic: string,
  fileName: string,
  chunks: Chunk[],
  hash: string,
  size: number,
  duplicate?: string,
};

type Chunk = {
  hash: string,
  start: number
  end: number
  size: number
};

type UploadState = {
  status:
  'loading' |
  'ready' |
  'interrupted' |
  'preparing' |
  'hashing' |
  'hashed' |
  'duplicate' |
  'uploading' |
  'finishing' |
  'complete' |
  'error',
  file?: File,
  name?: string,
  dataset?: Dataset,
  error?: string,
};

const oneMiB = 1024 * 1024;
const chunkSize = 2 * oneMiB;

const hashBlob = async (blob: Blob) => {
  const buffer = await blob.arrayBuffer();
  const hash = await crypto.hash(buffer);
  return hash;
};

export default function useUpload() {
  const { status } = useSession();
  const [state, setState] = useState<UploadState>({
    status: 'loading',
  });

  useEffect(() => {
    (async () => {
      if (status !== 'authenticated') {
        return;
      }
      if (state.status === 'loading') {
        const { dataset } = await api.upload.check();
        if (dataset) {
          setState({
            status: 'interrupted',
            dataset,
          });
        } else {
          setState({
            status: 'ready',
          });
        }
        return;
      }
      if (state.status === 'preparing' && state.file) {
        const { file } = state;
        if (state.dataset?.fileName === file.name) {
          setState({
            status: 'uploading',
            dataset: state.dataset,
            file,
          });
          return;
        }
        const firstChunk = file?.slice(0, chunkSize);
        const chunkHash = await hashBlob(firstChunk);
        const dataset = await api.upload.start({
          name: state.name || null,
          fileName: file.name,
          path: null,
          size: file.size,
          chunkHash,
        });
        if (dataset.error) {
          setState({
            status: 'error',
            error: dataset.error,
          });
          return;
        }
        dataset.chunks = [];
        if (dataset.duplicate) {
          setState({
            status: 'hashing',
            dataset,
            file,
          });
          return;
        }
        setState({
          status: 'uploading',
          dataset,
          file,
        });
        return;
      }
      if (state.status === 'hashing') {
        const { dataset, file } = state;
        if (!dataset || !file) {
          return;
        }
        const { chunks } = dataset;
        const cursor = chunks.at(-1)?.end || 0;
        if (cursor === dataset.size) {
          setState({
            dataset,
            file,
            status: 'hashed',
          });
          return;
        }
        const blob = file.slice(cursor, cursor + chunkSize);
        const hash = await hashBlob(blob);
        const chunk = {
          mnemonic: dataset.mnemonic,
          start: cursor,
          end: cursor + blob.size,
          size: dataset.size,
          hash,
        };
        setState({
          status: 'hashing',
          file,
          dataset: {
            ...dataset,
            chunks: [...dataset.chunks, chunk],
          },
        });
        return;
      }
      if (state.status === 'hashed') {
        const { dataset, file } = state;
        if (!dataset || !file) {
          return;
        }
        const { chunks } = dataset;
        const buffers = chunks.map(
          (chunk) => crypto.base64url.toUint8(chunk.hash),
        );
        const merged = await new Blob([...buffers]).arrayBuffer();
        const hash = await crypto.hash(merged);
        if (dataset.duplicate === hash) {
          await api.upload.cancel(dataset.mnemonic);
          setState({
            status: 'duplicate',
            dataset,
          });
          return;
        }
        setState({
          status: 'uploading',
          file,
          dataset,
        });
        return;
      }

      if (state.status === 'uploading') {
        const { dataset, file } = state;
        if (!dataset || !file) {
          return;
        }
        const { chunks } = dataset;
        const cursor = chunks.at(-1)?.end || 0;
        if (cursor === dataset.size) {
          setState({
            dataset,
            file,
            status: 'finishing',
          });
          return;
        }
        const blob = file.slice(cursor, cursor + chunkSize);
        const hash = await hashBlob(blob);
        const chunk = await api.upload.chunk({
          mnemonic: dataset.mnemonic,
          start: cursor,
          end: cursor + blob.size,
          size: dataset.size,
          data: blob,
          hash,
        });
        if (chunk.error) {
          setState({
            status: 'error',
            error: chunk.error,
          });
          return;
        }
        setState({
          status: 'uploading',
          file,
          dataset: {
            ...dataset,
            chunks: [...dataset.chunks, chunk],
          },
        });
        return;
      }
      if (state.status === 'finishing') {
        const { dataset } = state;
        if (!dataset) {
          return;
        }
        const { chunks } = dataset;
        const buffers = chunks.map(
          (chunk) => crypto.base64url.toUint8(chunk.hash),
        );
        const merged = await new Blob([...buffers]).arrayBuffer();
        const hash = await crypto.hash(merged);
        const result = await api.upload.finish(dataset.mnemonic);
        if (result.error) {
          setState({
            status: 'error',
            error: result.error,
          });
          return;
        }
        if (result.hash !== hash) {
          setState({
            status: 'error',
            error: `Upload hash mismatch server:${result.hash} client:${hash}`,
          });
          return;
        }
        setState({
          status: 'complete',
          dataset,
        });
      }
    })();
  }, [state, status]);

  return {
    debug: JSON.stringify(state, null, 2),
    start: (file: File, name?: string) => {
      if (state.status === 'interrupted') {
        setState({
          status: 'preparing',
          dataset: state.dataset,
          file,
        });
        return;
      }
      setState({
        status: 'preparing',
        file,
        name,
      });
    },
  };
}
