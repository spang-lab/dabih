/* eslint-disable no-await-in-loop */

'use client';

import crypto from '@/lib/crypto';
import storage from '@/lib/storage';
import React, { useCallback, useState } from 'react';
import { Download } from 'react-feather';
import { useApi } from '../api';
import useDialog from '../dialog';
import Progress from './Progress';

export default function FilesystemDownload({ mnemonic }) {
  const api = useApi();
  const dialog = useDialog();

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
        dialog.error(err);
        return null;
      }
    };
    if (!api.isReady() || !mnemonic) {
      return;
    }
    const dataset = await api.fetchDataset(mnemonic);
    const privateKey = await storage.readKey();
    const keyHash = await crypto.privateKey.toHash(privateKey);
    const encryptedKey = await api.fetchKey(mnemonic, keyHash);
    const aesKey = await crypto.privateKey.decryptAesKey(privateKey, encryptedKey);
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
      const encrypted = await api.fetchChunk(mnemonic, hash);
      const buffer = await encrypted.arrayBuffer();
      const decrypted = await crypto.aesKey.decrypt(aesKey, iv, buffer);
      await stream.write(decrypted);
      setCurrent(end);
    }
    await stream.close();
    setSize(null);
  }, [api, mnemonic, dialog]);

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
