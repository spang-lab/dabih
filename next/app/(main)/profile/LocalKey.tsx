'use client';

import useKey from '@/lib/hooks/key';
import React from 'react';
import Link from 'next/link';
import storage from '@/lib/storage';

import {
  Key, XCircle,
} from 'react-feather';

export default function LocalKey() {
  const key = useKey();

  const { status, hash } = key;

  if (status === 'loading') {
    return null;
  }

  if (status === 'unregistered' || status === 'no_key') {
    return (
      <div className="flex grow flex-row flex-wrap items-center">
        <div className="bg-red text-white font-extrabold rounded-full px-2 py-1 mx-3">
          {status}
        </div>
        <div className="text-lg inline-flex items-center mx-3">
          Go to the
          <Link
            className="text-blue hover:underline inline-flex items-center mx-2"
            href="/key"
          >
            <Key className="mr-1" />
            Key page
          </Link>
          to create a new key.
        </div>
      </div>
    );
  }

  if (status === 'unloaded') {
    return (
      <div className="flex grow flex-row flex-wrap items-center">
        <div className="bg-gray-700 text-white font-extrabold rounded-full px-2 py-1 mx-3">
          not loaded
        </div>
        <div className="text-lg inline-flex items-center mx-3">
          Go to the
          <Link
            className="text-blue hover:underline inline-flex items-center mx-2"
            href="/key"
          >
            <Key className="mr-1" />
            Key page
          </Link>
          to load a private key.
        </div>
      </div>
    );
  }
  if (status === 'disabled' || status === 'no_enabled_key') {
    return (
      <div className="flex grow flex-row flex-wrap items-center">
        <div className="bg-red text-white font-extrabold rounded-full px-2 py-1 mx-3">
          disabled
        </div>
        <div className="text-lg inline-flex items-center mx-3">
          Please contact the
          <Link
            className="text-blue hover:underline inline-flex items-center mx-2"
            href="/docs/contact"
          >
            <Key className="mr-1" />
            admin
          </Link>
          to enable your key.
        </div>
      </div>
    );
  }

  return (
    <div className="flex grow flex-row flex-wrap justify-between items-center">
      <div className="bg-green text-white font-extrabold rounded-full px-2 py-1 mx-3">
        loaded
      </div>
      <div>
        <span>Fingerprint:</span>
        {' '}
        <span className="text-xs font-mono">{hash}</span>
      </div>
      <div className="text-gray-500 text-xs">
        Saved in browser local storage
      </div>
      <div>
        <button
          type="button"
          className="bg-blue text-white py-1 px-2 rounded-md inline-flex items-center"
          onClick={() => {
            storage.deleteKey();
          }}
        >
          <XCircle className="mr-2" />
          Unload
        </button>
      </div>
    </div>
  );
}
