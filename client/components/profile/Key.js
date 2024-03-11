'use client';

import { Key, Delete } from 'react-feather';
import storage from '@/lib/storage';

export default function CryptoKey() {
  const key = storage.useKey();
  if (!key) {
    return 'No key';
  }

  return (
    <div className="flex items-center p-2 m-2 text-sm bg-white border border-gray-400 rounded-xl space-x-4">
      <div className="p-1 border text-blue justify-self-start border-blue rounded-md">
        <Key />
      </div>
      <div>
        <div className="text-lg font-semibold text-black">
          Key
          {' '}
          <span className="text-green">loaded</span>
        </div>

        <p>Fingerprint:</p>
        <p className="text-xs font-mono">{key.hash}</p>
      </div>
      <div className="justify-self-end text-center">
        <button
          type="button"
          className="bg-red text-white py-1 px-2 rounded-md inline-flex items-center"
          onClick={() => storage.deleteKey()}
        >
          Drop
          <Delete className="ml-2" />
        </button>
      </div>
    </div>
  );
}
