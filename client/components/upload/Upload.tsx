'use client';

/* eslint-disable no-await-in-loop, no-continue */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Transition } from '@headlessui/react';

import crypto from '@/lib/crypto';

import { useSession } from 'next-auth/react';
import api from '@/lib/api';
import Dropzone from './DropZone';
import Progess from './Progress';
import useDialog from '../dialog';

const oneMiB = 1024 * 1024;
const chunkSize = 2 * oneMiB;

const hashBlob = async (blob: Blob) => {
  const buffer = await blob.arrayBuffer();
  const hash = await crypto.hash(buffer);
  return hash;
};

const hashHashes = async (hashes: string[]) => {
  const buffers = hashes.map((base64) => crypto.base64url.toUint8(base64));
  const merged = await new Blob([...buffers]).arrayBuffer();
  return crypto.hash(merged);
};

const hashFile = async (file: File) => {
  const { size } = file;

  const hashes: string[] = [];
  for (let b = 0; b < size; b += chunkSize) {
    const blob = file.slice(b, b + chunkSize);
    const buffer = await blob.arrayBuffer();
    hashes.push(await crypto.hash(buffer));
  }
  return hashHashes(hashes);
};

export default function Upload({ disabled }) {
  const dialog = useDialog();
  const { status } = useSession();
  const [uploadMessage, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const [upload, setUpload] = useState<any>(null);
  const lastChunk = upload?.chunks.at(-1);
  const bytes = lastChunk?.end || 0;

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }
    (async () => {
      const { dataset } = await api.upload.check();
      if (dataset) {
        setUpload({
          ...dataset,
          file: null,
        });
      }
    })();
  }, [status]);

  useEffect(() => {
    const uploadChunk = async () => {
      if (!upload || !upload.file) {
        return;
      }
      if (upload.hash) {
        const result = await api.upload.finish(upload.mnemonic);
        if (result.hash !== upload.hash) {
          dialog.error(
            `Upload hash mismatch server:${result.hash} client:${upload.hash}`,
          );
        }
        setMessage(
          `File "${upload.fileName}" uploaded successfully`,
        );
        setUpload(null);
        return;
      }
      const { mnemonic, file, chunks } = upload;
      const { size } = file;
      const b = chunks.at(-1)?.end || 0;
      if (b === size) {
        const hashes = chunks.map((c: any) => c.hash);
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
      const chunk = await api.upload.chunk({
        mnemonic,
        start: b,
        end: b + blob.size,
        size,
        data: blob,
        hash,

      });

      if (chunk.error) {
        return;
      }

      setUpload({
        ...upload,
        chunks: [...chunks, chunk],
      });
    };
    uploadChunk();
  }, [upload, dialog]);

  const getFile = (files: File[]) => {
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
    await api.upload.cancel(mnemonic);
    setUpload(null);
  };

  const onFileChange = async (files: File[]) => {
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
    const dataset = await api.upload.start({
      name,
      fileName,
      path: null,
      size,
      chunkHash,
    });

    if (dataset.error || !dataset.mnemonic) {
      dialog.error(dataset.error);
      return;
    }

    if (dataset.duplicate) {
      // dataset could be a duplicate, check the total hash to be sure
      const hash = await hashFile(file);
      if (hash === dataset.duplicate) {
        setUpload(null);
        await api.upload.cancel(dataset.mnemonic);
        setMessage(`File ${dataset.fileName} skipped, you already uploaded it`);
        return;
      }
    }

    setUpload({
      ...dataset,
      chunks: [],
      file,
    });
  };

  const getMessage = () => {
    if (!uploadMessage) {
      return null;
    }
    return (
      <div className="p-3 m-3 text-base text-center text-green bg-green/20 rounded-lg">
        <p className="font-extrabold">
          {uploadMessage}
        </p>
        <Link className="text-blue hover:underline" href="/manage">
          Manage your data here
        </Link>
      </div>
    );
  };

  return (
    <div>
      {getMessage()}
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
