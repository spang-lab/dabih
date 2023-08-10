import React, {
  useEffect, useState, useCallback, useRef,
} from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, Printer } from 'react-feather';

import { useUsers } from '../../hooks';
import Key from './Key';

import { Spinner } from '../../util';
import DownloadButton from './DownloadButton';
import { generateKey, exportPrivateKey } from '../../../lib';
import { useApi } from '../../api';
import useDialog from '../../dialog';

export default function GenerateKey({ onComplete }) {
  const [privateKey, setPrivateKey] = useState(null);
  const [keyFile, setKeyfile] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [wasSaved, setSaved] = useState(false);
  const { fetchUsers } = useUsers();
  const dialog = useDialog();
  const keyRef = useRef();
  const { addPublicKey } = useApi();

  const print = useReactToPrint({
    pageStyle:
      '@page { size: auto; margin: 10mm } @media print { body { -webkit-print-color-adjust: exact; } }',
    content: () => keyRef.current,
  });

  const generate = useCallback(async () => {
    try {
      const keypair = await generateKey();
      setPublicKey(keypair.publicKey);
      setPrivateKey(keypair.privateKey);
      const file = await exportPrivateKey(keypair.privateKey);
      setKeyfile(file);
    } catch (err) {
      dialog.error(err);
    }
  }, [dialog]);

  const uploadKey = useCallback(async () => {
    await addPublicKey(publicKey);
    await fetchUsers();
    onComplete();
  }, [publicKey, addPublicKey, onComplete, fetchUsers]);

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
          onClick={() => onComplete()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
