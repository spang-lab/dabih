/* eslint-disable no-await-in-loop */
import React, { useState } from 'react';

import { Transition } from '@headlessui/react';
import { useMessages } from '../messages';

import { hashBlob, hashHashes } from '../../lib';

import Dropzone from './DropZone';
import Progess from './Progress';
import { useApi } from '../api';
import { Link } from '../util';

export default function Upload({ disabled }) {
  const log = useMessages();
  const api = useApi();
  const [uploadBytes, setUploadBytes] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadSuccess, setSuccess] = useState(null);

  const getFile = (files) => {
    if (!files.length) {
      return null;
    }
    if (files.length > 1) {
      log.error('Sorry, multiple files are currently not supported');
      return null;
    }
    const [file] = files;
    return file;
  };

  const uploadChunks = async (file, mnemonic) => {
    const { size } = file;
    const oneMiB = 1024 * 1024;
    const chunkSize = 2 * oneMiB;
    const hashes = [];

    for (let i = 0; i < size; i += chunkSize) {
      setUploadBytes(i);
      const blob = file.slice(i, i + chunkSize);
      const hash = await hashBlob(blob);
      hashes.push(hash);
      const chunk = {
        start: i,
        end: i + blob.size,
        totalSize: size,
        data: blob,
        hash,
      };
      await api.uploadChunk(chunk, mnemonic);
    }

    const fullHash = await hashHashes(hashes);
    setUploadBytes(size);
    return fullHash;
  };

  const onFileChange = async (files) => {
    const file = getFile(files);
    if (!file) return;
    const { name, size } = file;
    setUploadFile({
      size,
      name,
    });
    const dataset = await api.uploadStart(name);
    const { mnemonic } = dataset;
    const dataHash = await uploadChunks(file, mnemonic);
    const result = await api.uploadFinish(mnemonic);
    if (result.hash !== dataHash) {
      log.error(`Upload hash mismatch server:${result.hash} client:${dataHash}`);
    }
    setSuccess(file.name);
    setUploadFile(null);
  };

  const fileName = (uploadFile) ? uploadFile.name : '';
  const total = (uploadFile) ? uploadFile.size : '';
  const current = uploadBytes || 0;

  const getSuccessMessage = () => {
    if (!uploadSuccess) {
      return null;
    }
    return (
      <div className="p-3 m-3 text-base text-center text-green-800 bg-green-100 rounded-lg">
        <p className="font-extrabold">
          File
          &quot;
          {uploadSuccess}
          &quot;
          uploaded
          successfully.
        </p>
        <Link href="/manage">
          Manage your data here
        </Link>
      </div>
    );
  };

  return (
    <div>
      {getSuccessMessage()}
      <Transition
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        show={!uploadFile}
      >
        <Dropzone disabled={disabled} onChange={onFileChange} />
      </Transition>
      <Transition
        appear
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        show={!!uploadFile}
      >
        <Progess fileName={fileName} current={current} total={total} />
      </Transition>
    </div>
  );
}
