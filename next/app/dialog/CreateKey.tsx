
import React, {
  useEffect, useState, useRef,
} from 'react';
import { DialogPanel, DialogTitle } from '@headlessui/react';
import { useReactToPrint } from 'react-to-print';
import { Download, Printer } from 'react-feather';
import QRCode from 'qrcode';

import crypto from '@/lib/crypto';
import { Spinner } from '@/app/util';
import Key from './Key';
import { DialogShakeTransition } from './Transition';

interface KeyData {
  privateKey: CryptoKey,
  publicKey: JsonWebKey,
  hexData: string[],
  pemUrl: string,
  qrCode: string,
  isSaved: boolean,
}

export default function CreateKeyDialog({ show, onClose, onSubmit }:
  { show: boolean, onClose: () => void, onSubmit: (key: JsonWebKey) => void }) {
  const [keyData, setKeyData] = useState<KeyData | null>(null);

  const keyRef = useRef<HTMLDivElement>(null);

  const print = useReactToPrint({
    pageStyle:
      '@page { size: auto; margin: 10mm } @media print { body { -webkit-print-color-adjust: exact; } }',
    contentRef: keyRef,
  });

  const close = () => {
    setKeyData(null);
    onClose();
  }

  useEffect(() => {
    if (!show) {
      return;
    }
    (async () => {
      const privateKey = await crypto.privateKey.generate();
      const publicKey = await crypto.privateKey.toPublicKey(privateKey);
      const publicJWK = await crypto.privateKey.toJWK(publicKey);
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
        publicKey: publicJWK,
        hexData,
        qrCode,
        pemUrl,
        isSaved: false,
      });
    })().catch((err) => console.error(err));
  }, [show]);

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
            onClick={() => print()}
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
    <DialogShakeTransition show={show}>
      <DialogPanel
        className=" w-full max-w-5xl p-6 overflow-hidden text-left align-middle bg-white shadow-xl transform rounded-2xl transition-all"
      >
        <DialogTitle
          as="h2"
          className="text-2xl font-extrabold text-gray-800 leading-6"
        >
          Generate a new keypair
        </DialogTitle>
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
            px-8 py-4 mx-2 mt-2 text-2xl rounded-xl bg-blue
            text-white
            disabled:opacity-50`}
            disabled={!(keyData?.isSaved)}
            onClick={() => {
              onSubmit(keyData!.publicKey);
              close();
            }}
          >
            Upload this key to
            {' '}
            <span className="font-bold">dabih</span>
          </button>
          <button
            type="button"
            className="mx-3 px-3 py-2 text-white bg-gray-400 rounded-md"
            onClick={close}
          >
            Cancel
          </button>
        </div>
      </DialogPanel>
    </DialogShakeTransition>
  );
}
