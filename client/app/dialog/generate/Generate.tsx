'use client';

import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Printer } from 'react-feather';

import crypto from '@/lib/crypto';
import { Dialog } from '@headlessui/react';
import { Spinner } from '@/app/util';

import DownloadButton from './DownloadButton';
import Key from './Key';

export default function GenerateKey({ ctx, closeDialog }) {
  const { onSubmit } = ctx;
  const [privateKey, setPrivateKey] = useState(null);
  const [keyFile, setKeyfile] = useState(null);
  const [wasSaved, setSaved] = useState(false);
  const keyRef = useRef();

  const print = useReactToPrint({
    pageStyle:
      '@page { size: auto; margin: 10mm } @media print { body { -webkit-print-color-adjust: exact; } }',
    content: () => keyRef.current,
  });

  const generate = useCallback(async () => {
    try {
      const privKey = await crypto.privateKey.generate();
      setPrivateKey(privKey);
      const pem = await crypto.privateKey.toPEM(privKey);
      setKeyfile(pem);
    } catch (err) {
      onSubmit({ error: err });
      closeDialog();
    }
  }, [onSubmit, closeDialog]);

  const uploadKey = async () => {
    const publicKey = await crypto.privateKey.toPublicKey(privateKey);
    const jwk = await crypto.publicKey.toJWK(publicKey);
    onSubmit(jwk);
    closeDialog();
  };

  useEffect(() => {
    generate();
  }, [generate]);

  const getLoader = () => {
    if (!privateKey) {
      return (
        <div className="flex my-10 items-center justify-center h-32">
          <Spinner />
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog.Panel
      className=" w-full max-w-5xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all"
    >
      <Dialog.Title
        as="h2"
        className="text-2xl font-extrabold text-gray-800 leading-6"
      >
        Generate a new keypair
      </Dialog.Title>
      <div className="mt-2">
        <p className="text-sm text-gray-400">
          You
          <span className="font-semibold text-blue"> need </span>
          to save your private key after generating it.
        </p>
      </div>
      <div className="text-center">
        {getLoader()}
        <Key privateKey={privateKey} ref={keyRef} />
        <p className="text-2xl">
          <span className="font-extrabold underline text-red"> Warning: </span>
          If you do not save this key you will
          <span className="font-extrabold underline text-red">
            {' '}
            not be able to access your data
            {' '}
          </span>
        </p>
        <span className="text-2xl">Please</span>
        <button
          type="button"
          className="m-2 px-3 py-2 text-lg rounded bg-blue text-gray-100 hover:text-white"
          onClick={print}
        >
          <Printer className="inline-block" size={30} />
          {' '}
          Print the key
        </button>
        <span className="text-2xl">and</span>
        <DownloadButton
          className="m-2"
          file={keyFile}
          fileName="dabih_private_key.pem"
          onDownload={() => setSaved(true)}
        >
          <Download className="inline-block" size={30} />
          {' '}
          Download the Keyfile
        </DownloadButton>
      </div>
      <div className="text-end">
        <button
          type="button"
          className={`
            px-8 py-4 mx-2 mt-2 text-2xl rounded-xl text-gray-100 bg-blue
            enabled:hover:bg-blue enabled:hover:text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50`}
          disabled={!wasSaved}
          onClick={uploadKey}
        >
          Upload this key to
          {' '}
          <span className="font-bold">dabih</span>
        </button>
        <button
          type="button"
          className="mx-3 px-3 py-2 text-white bg-gray-400 hover:text-white rounded-md"
          onClick={closeDialog}
        >
          Cancel
        </button>
      </div>
    </Dialog.Panel>
  );
}
