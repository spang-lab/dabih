'use client';

import React, {
  useEffect, useState, useRef,
} from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Printer } from 'react-feather';

import crypto from '@/lib/crypto';
import { Dialog } from '@headlessui/react';
import { Spinner } from '@/app/util';

import QRCode from 'qrcode';
import Key from './Key';

interface KeyData {
  privateKey: CryptoKey,
  publicKey: CryptoKey,
  hexData: string[],
  pemUrl: string,
  qrCode: string,
  isSaved: boolean,
}

export default function GenerateKey({ ctx, closeDialog }) {
  const { onSubmit } = ctx;
  const [keyData, setKeyData] = useState<KeyData | null>(null);

  const keyRef = useRef();

  const print = useReactToPrint({
    pageStyle:
      '@page { size: auto; margin: 10mm } @media print { body { -webkit-print-color-adjust: exact; } }',
    content: () => keyRef.current ?? null,
  });

  useEffect(() => {
    (async () => {
      const privateKey = await crypto.privateKey.generate();
      const publicKey = await crypto.privateKey.toPublicKey(privateKey);
      const pemData = await crypto.privateKey.toPEM(privateKey);
      const pemFile = new Blob([pemData], { type: 'text/plain' });
      const pemUrl = window.URL.createObjectURL(pemFile);
      const hexData = await crypto.privateKey.toHex(privateKey);
      const json = await crypto.privateKey.toJSON(privateKey);
      const qrCode = await QRCode.toDataURL(json, {
        errorCorrectionLevel: 'M',
        width: 600,
      });
      setKeyData({
        privateKey,
        publicKey,
        hexData,
        qrCode,
        pemUrl,
        isSaved: false,
      });
    })().catch((err) => console.error(err));
  }, []);

  const getContent = () => {
    if (!keyData) {
      return (
        <div className="flex my-10 items-center justify-center h-32">
          <Spinner />
        </div>
      );
    }
    const { qrCode, hexData, pemUrl } = keyData;
    return (
      <div>
        <Key
          qrCode={qrCode}
          hexData={hexData}
          ref={keyRef}
        />
        <p className="text-2xl">
          <span className="font-extrabold underline text-red"> Warning:</span>
          {' '}
          If you do not save this key you will
          {' '}
          <span className="font-extrabold underline text-red">
            not be able to access your data
          </span>
          {' '}
        </p>
        <div className="flex flex-row items-center justify-center">
          <span className="text-2xl">Please</span>
          <button
            type="button"
            className="m-2 px-3 py-2 text-lg rounded bg-blue text-white"
            onClick={print}
          >
            <Printer className="inline-block" size={30} />
            {' '}
            Print the key
          </button>
          <span className="text-2xl">and</span>
          <a
            href={qrCode}
            download="dabih_private_key_qrcode.png"
            className="button px-3 m-2 py-2 text-lg text-white bg-blue rounded"
          >
            <Download className="inline-block" size={30} />
            {' '}
            Download the QR Code
          </a>
          <span className="text-2xl">or</span>
          <a
            href={pemUrl}
            download="dabih_private_key.pem"
            className="button px-3 m-2 py-2 text-lg text-white bg-blue rounded"
            onClick={() => setKeyData({ ...keyData, isSaved: true })}
          >
            <Download className="inline-block" size={30} />
            {' '}
            Download the Keyfile
          </a>

        </div>
      </div>
    );
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
      {getContent()}
      <div className="text-end">
        <button
          type="button"
          className={`
            px-8 py-4 mx-2 mt-2 text-2xl rounded-xl text-gray-100 bg-blue
            enabled:hover:bg-blue enabled:hover:text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2
            focus:ring-offset-gray-800 focus:ring-white disabled:opacity-50`}
          disabled={!(keyData?.isSaved)}
          onClick={() => {
            onSubmit(keyData?.publicKey);
            closeDialog();
          }}
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
