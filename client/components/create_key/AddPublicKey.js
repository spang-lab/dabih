import React from 'react';
import { useDropzone } from 'react-dropzone';

import { Lock, File, FilePlus } from 'react-feather';
import { exportJwk, importPublicKey } from '../../lib';
import { useApi } from '../api';
import { BigButton } from '../util';
import useDialog from '../dialog';

export default function LoadFile() {
  const dialog = useDialog();
  const { addPublicKey } = useApi();

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
      const publicKey = await importPublicKey(text);
      const jwk = await exportJwk(publicKey);
      await addPublicKey(jwk);
    } catch (err) {
      dialog.error('File is not a valid public key');
    }
  };

  const {
    getRootProps, getInputProps, isDragActive, isDragReject,
  } = useDropzone({ onDrop });

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
            <Lock className="absolute inset-0 m-4 mt-6" size={20} />
          </div>
        </div>
        <BigButton>
          <span className="whitespace-nowrap">
            <File className="inline-block mx-3 mb-1" />
            Open public key file...
          </span>
        </BigButton>
        <p className="pt-3 text-gray-400">
          Add your own public key
          <br />
        </p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="px-3 pt-2 italic font-semibold text-left text-gray-400 text-md">
        Advanced users
      </div>
      <div {...getRootProps()} className="w-full grid place-content-center">
        <input {...getInputProps()} />
        {getCenter()}
      </div>
    </div>
  );
}
