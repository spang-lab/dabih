'use client';

import React from 'react';
import { useDropzone } from 'react-dropzone';

import { Key, File, FilePlus } from 'react-feather';
import { useRouter } from 'next/navigation';
import crypto from '@/lib/crypto';
import storage from '@/lib/storage';
import { useApi, useDialog } from '@/components';

export default function Dropzone() {
  const router = useRouter();
  const dialog = useDialog();
  const { checkPublicKey } = useApi();
  const onDrop = async (files) => {
    if (!files || !files.length) {
      return;
    }
    if (files.length > 1) {
      dialog.error('Only a single file is supported');
      return;
    }
    const [file] = files;
    const maxSize = 10 * 1024; // 10KiB
    if (file.size > maxSize) {
      dialog.error('File is too large to be a public key');
      return;
    }
    const text = await file.text();
    try {
      const key = await crypto.privateKey.fromPEM(text);
      const hash = await crypto.privateKey.toHash(key);

      const { valid, error } = await checkPublicKey(hash);
      if (!valid) {
        dialog.error(error);
        return;
      }
      await storage.storeKey(key);
      router.push('/manage');
    } catch (err) {
      dialog.error('File is not a valid public key');
    }
  };

  const {
    getRootProps, getInputProps, isDragActive, isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.pem'],
    },
  });

  const getCenter = () => {
    if (isDragReject) {
      return <p>NO</p>;
    }
    if (isDragActive) {
      return (
        <p>
          <FilePlus size={80} />
        </p>
      );
    }
    return (
      <div className="text-center">
        <div className="py-3">
          <div className="relative mx-auto w-14 h-14">
            <File className="" size={56} />
            <Key className="absolute inset-0 m-4 mt-6" size={20} />
          </div>
        </div>
        <button
          type="button"
          className="
            px-4 py-3 text-2xl rounded-xl text-gray-100 bg-blue
            enabled:hover:bg-blue enabled:hover:text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50"
        >
          <span className="whitespace-nowrap">
            <File className="inline-block mx-3 mb-1" />
            Open key file...
          </span>
        </button>
        <p className="pt-3 text-gray-400">
          Drop your dabih key file here
          <br />
          or click to select the key file.
          <br />
          This file will
          <span className="font-semibold text-blue"> not </span>
          be uploaded.
        </p>
      </div>
    );
  };

  return (
    <div {...getRootProps()} className="w-full p-5 grid place-content-center">
      <input {...getInputProps()} />
      {getCenter()}
    </div>
  );
}
