'use client';

/* eslint-disable no-await-in-loop, no-continue */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Transition } from '@headlessui/react';

import { hashBlob, hashHashes } from '../../lib';

import Dropzone from './DropZone';
import Progess from './Progress';
import { useApi } from '../api';
import useDialog from '../dialog';

const oneMiB = 1024 * 1024;
const chunkSize = 2 * oneMiB;

const hashFile = async (file) => {
  const { size } = file;

  const hashes = [];
  for (let b = 0; b < size; b += chunkSize) {
    const blob = file.slice(b, b + chunkSize);
    const hash = await hashBlob(blob);
    hashes.push(hash);
  }
  return hashHashes(hashes);
};

export default function Upload({ disabled }) {
  const api = useApi();
  const dialog = useDialog();
  const [uploadSuccess, setSuccess] = useState(null);
  const searchParams = useSearchParams();

  const [upload, setUpload] = useState(null);
  const lastChunk = upload?.chunks.at(-1);
  const bytes = lastChunk?.end || 0;

  useEffect(() => {
    if (!api.isReady()) {
      return;
    }
    const checkExisting = async () => {
      const existing = await api.uploadCheck();
      if (existing) {
        setUpload({
          ...existing,
          file: null,
        });
      }
    };
    checkExisting();
  }, [api]);

  useEffect(() => {
    const uploadChunk = async () => {
      if (!upload || !upload.file) {
        return;
      }
      if (upload.hash) {
        const result = await api.uploadFinish(upload.mnemonic);
        if (result.hash !== upload.hash) {
          dialog.error(
            `Upload hash mismatch server:${result.hash} client:${upload.hash}`,
          );
        }
        const message = `File "${upload.fileName}" uploaded successfully`;
        setSuccess(message);
        setUpload(null);
        return;
      }
      const { mnemonic, file, chunks } = upload;
      const { size } = file;
      const b = chunks.at(-1)?.end || 0;
      if (b === size) {
        const hashes = chunks.map((c) => c.hash);
        const hash = await hashHashes(hashes);
        setUpload({
          ...upload,
          hash,
        });
        return;
      }
      if (b > size) {
        throw new Error('Unknown upload failure');
      }
      const blob = file.slice(b, b + chunkSize);
      const hash = await hashBlob(blob);
      const chunk = {
        start: b,
        end: b + blob.size,
        totalSize: size,
        data: blob,
        hash,
      };
      const newChunk = await api.uploadChunk(chunk, mnemonic);

      if (newChunk.error) {
        return;
      }

      setUpload({
        ...upload,
        chunks: [...chunks, newChunk],
      });
    };
    uploadChunk();
  }, [upload, api, dialog]);

  const getFile = (files) => {
    if (!files.length) {
      return null;
    }
    if (files.length > 1) {
      dialog.error('Sorry, multiple files are currently not supported');
      return null;
    }
    const [file] = files;
    return file;
  };

  const cancelUpload = async () => {
    const { mnemonic } = upload;
    await api.uploadCancel(mnemonic);
    setUpload(null);
  };

  const onFileChange = async (files) => {
    const file = getFile(files);
    if (!file) return;
    const { size } = file;
    const fileName = file.name;

    if (upload && upload.fileName === fileName) {
      setUpload({
        ...upload,
        file,
      });
      return;
    }

    const firstChunk = file.slice(0, chunkSize);
    const chunkHash = await hashBlob(firstChunk);
    const name = searchParams.get('name');

    const dataset = await api.uploadStart(fileName, size, chunkHash, name);
    if (dataset.error || !dataset.mnemonic) {
      dialog.error(dataset.error);
      return;
    }

    if (dataset.duplicate) {
      // dataset could be a duplicate, check the total hash to be sure
      const hash = await hashFile(file);
      if (hash === dataset.duplicate) {
        setUpload(null);
        await api.uploadCancel(dataset.mnemonic);
        const message = `File ${dataset.fileName} skipped, you already uploaded it`;
        setSuccess(message);
        return;
      }
    }

    setUpload({
      ...dataset,
      chunks: [],
      file,
    });
  };

  const getSuccessMessage = () => {
    if (!uploadSuccess) {
      return null;
    }
    return (
      <div className="p-3 m-3 text-base text-center text-green bg-green/20 rounded-lg">
        <p className="font-extrabold">
          {uploadSuccess}
        </p>
        <Link className="text-blue hover:underline" href="/manage">
          Manage your data here
        </Link>
      </div>
    );
  };

  return (
    <div>
      {getSuccessMessage()}
      <Transition
        appear
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        show={!!upload}
      >
        <Progess
          fileName={upload?.fileName}
          running={!!(upload?.file)}
          current={bytes}
          total={upload?.size}
        />
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-gray-500 text-white px-2 py-2 rounded-md"
            onClick={cancelUpload}
          >
            Cancel Upload
          </button>
        </div>
      </Transition>
      <Transition
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        show={!upload?.file}
      >
        <Dropzone disabled={disabled} onChange={onFileChange} />
      </Transition>
    </div>
  );
}
