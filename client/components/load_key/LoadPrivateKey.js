import React from 'react';
import { useDropzone } from 'react-dropzone';

import { Key, File, FilePlus } from 'react-feather';
import { useRouter } from 'next/router';
import { BigButton } from '../util';
import { useMessages } from '../messages';
import { importPrivateKey, storage } from '../../lib';
import { useApi } from '../api';

export default function LoadFile() {
  const log = useMessages();
  const router = useRouter();
  const { checkPublicKey } = useApi();
  const onDrop = async (files) => {
    if (!files || !files.length) {
      return;
    }
    if (files.length > 1) {
      log.error('Only a single file is supported');
      return;
    }
    const [file] = files;
    const maxSize = 10 * 1024; // 10KiB
    if (file.size > maxSize) {
      log.error('File is too large to be a public key');
      return;
    }
    const text = await file.text();
    try {
      const keys = await importPrivateKey(text, 'pem');
      const { valid, error } = await checkPublicKey(keys.hash);
      if (!valid) {
        log.error(error);
        return;
      }
      await storage.storeKey(keys.privateKey);
      router.push('/manage');
    } catch (err) {
      log.error('File is not a valid public key');
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
        <BigButton>
          <span className="whitespace-nowrap">
            <File className="inline-block mx-3 mb-1" />
            Open key file...
          </span>
        </BigButton>
        <p className="pt-3 text-gray-400">
          Drop your dabih key file here
          <br />
          or click to select the key file.
          <br />
          This file will
          <span className="font-semibold text-main-200"> not </span>
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
