/* eslint-disable no-await-in-loop */

'use client';

import {
  decryptKey, decryptChunk, encodeHash, storage,
} from '@/lib';
import React, { useCallback, useState } from 'react';
import { Download } from 'react-feather';
import { useApi } from '../api';
import Progress from './Progress';

export default function FilesystemDownload({ mnemonic }) {
  const api = useApi();

  const [size, setSize] = useState(null);
  const [current, setCurrent] = useState(0);

  const onClick = useCallback(async () => {
    const getHandle = async (fileName) => {
      try {
        const result = await window.showSaveFilePicker({
          suggestedName: fileName,
        });
        return result;
      } catch (err) {
        console.log(err);
        return null;
      }
    };
    if (!api.isReady() || !mnemonic) {
      return;
    }
    const dataset = await api.fetchDataset(mnemonic);
    const keys = await storage.readKey();
    const key = await api.fetchKey(mnemonic, keys.hash);
    const aesKey = await decryptKey(keys.privateKey, key);
    const { fileName, chunks } = dataset;
    setSize(dataset.size);

    const handle = await getHandle(fileName);
    if (!handle) {
      return;
    }
    const stream = await handle.createWritable();

    for (let i = 0; i < chunks.length; i += 1) {
      const chunk = chunks[i];
      const { iv, hash, end } = chunk;
      const hashurl = encodeHash(hash);
      const encrypted = await api.fetchChunk(mnemonic, hashurl);
      const decrypted = await decryptChunk(aesKey, iv, encrypted);
      await stream.write(decrypted);
      setCurrent(end);
    }
    await stream.close();
    setSize(null);
  }, [api, mnemonic]);

  if (size) {
    return (
      <Progress
        current={current}
        total={size}
      />
    );
  }

  return (
    <button
      type="button"
      className="flex px-2 py-1 text-sm font-extrabold text-white rounded bg-blue hover:bg-blue flex-nowrap"
      onClick={onClick}
    >
      <Download className="inline-block mr-2" size={20} />
      Download
    </button>
  );
}
