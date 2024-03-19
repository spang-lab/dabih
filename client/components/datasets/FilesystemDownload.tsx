/* eslint-disable no-await-in-loop */

'use client';

import crypto from '@/lib/crypto';
import storage from '@/lib/storage';
import React, { useCallback, useState } from 'react';
import { Download } from 'react-feather';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import { useKey } from '@/lib/hooks';
import useDialog from '../dialog';
import Progress from './Progress';

export default function FilesystemDownload({ mnemonic }) {
  const dialog = useDialog();
  const [size, setSize] = useState(null);
  const [current, setCurrent] = useState(0);
  const { status } = useSession();
  const key = useKey();

  const onClick = useCallback(async () => {
    const getHandle = async (fileName) => {
      try {
        const result = await window.showSaveFilePicker({
          suggestedName: fileName,
        });
        return result;
      } catch (err: any) {
        dialog.error(err.toString());
        return null;
      }
    };
    if (status !== 'authenticated' || !key || !mnemonic) {
      return;
    }
    const keyHash = await crypto.privateKey.toHash(key);
    const result = await api.dataset.key(mnemonic, keyHash);
    const aesBuffer = await crypto.privateKey.decryptAesKey(key, result.key);
    const aesKey = await crypto.aesKey.fromUint8(aesBuffer);
    const dataset = await api.dataset.get(mnemonic);
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
      const encrypted = await api.dataset.chunk(mnemonic, hash);
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
