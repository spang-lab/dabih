import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Printer } from 'react-feather';

import Key from './Key';
import { useMessages } from '../messages';

import {
  BigButton,
  ColoredButton,
  MutedButton,
  Spinner,
} from '../util';
import DownloadButton from './DownloadButton';
import { generateKey, exportPrivateKey } from '../../lib';
import { useApi } from '../api';

const delay = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

export default function GenerateKey({ onComplete }) {
  const [privateKey, setPrivateKey] = useState(null);
  const [keyFile, setKeyfile] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [wasSaved, setSaved] = useState(false);
  const log = useMessages();
  const keyRef = useRef();
  const { addPublicKey } = useApi();

  const print = useReactToPrint({
    pageStyle:
      '@page { size: auto; margin: 10mm } @media print { body { -webkit-print-color-adjust: exact; } }',
    content: () => keyRef.current,
  });

  const generate = useCallback(async () => {
    // Generating a keypair is to fast to feel important, so make it slower
    await delay(300);
    try {
      const keypair = await generateKey();
      setPublicKey(keypair.publicKey);
      setPrivateKey(keypair.privateKey);
      const file = await exportPrivateKey(keypair.privateKey);
      setKeyfile(file);
    } catch (err) {
      log.error(err);
    }
  }, [log]);

  const uploadKey = useCallback(async () => {
    await addPublicKey(publicKey);
    onComplete();
  }, [publicKey, addPublicKey, onComplete]);

  useEffect(() => {
    generate();
  }, [generate]);

  if (!privateKey || !publicKey) {
    return (
      <div className="flex items-center justify-center h-32">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <Key data={privateKey} ref={keyRef} />
        <p className="text-2xl">
          <span className="font-extrabold underline text-red">
            {' '}
            Warning:
            {' '}
          </span>
          If you do not save this key you will
          <span className="font-extrabold underline text-red">
            {' '}
            not be able to access your data
            {' '}
          </span>
        </p>
        <span className="text-2xl">Please</span>
        <ColoredButton className="m-2" onClick={print}>
          <Printer className="inline-block" size={30} />
          {' '}
          Print the key
        </ColoredButton>
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
        <BigButton
          className="mx-2 mt-2"
          disabled={!wasSaved}
          onClick={uploadKey}
        >
          Upload this key to
          {' '}
          <span className="font-bold">dabih</span>
        </BigButton>
        <MutedButton onClick={() => onComplete()}>Cancel</MutedButton>
      </div>
    </div>
  );
}
