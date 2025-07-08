'use client';


import useSession from '@/Session';
import crypto from '@/lib/crypto';
import { useEffect, useState } from 'react';
import {
  Key, XCircle,
} from 'react-feather';
import { Link } from 'react-router';

export default function LocalKey() {
  const { key, status, dropKey } = useSession();

  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    if (!key) {
      setHash(null);
      return;
    }
    crypto.privateKey.toHash(key)
      .then(setHash)
      .catch(console.error);
  }, [key]);




  if (status === 'loading') {
    return null;
  }

  if (status === "registered_without_key") {
    return (
      <div className="flex grow flex-row flex-wrap items-center">
        <div className="bg-red text-white font-extrabold rounded-full px-2 py-1 mx-3">
          {status}
        </div>
        <div className="text-lg inline-flex items-center mx-3">
          Go to the
          <Link
            className="text-blue hover:underline inline-flex items-center mx-2"
            to="/key"
          >
            <Key className="mr-1" />
            Key page
          </Link>
          to create a new key.
        </div>
      </div>
    );
  }

  if (status === 'registered') {
    return (
      <div className="flex grow flex-row flex-wrap items-center">
        <div className="bg-gray-700 text-white font-extrabold rounded-full px-2 py-1 mx-3">
          not loaded
        </div>
        <div className="text-lg inline-flex items-center mx-3">
          Go to the
          <Link
            className="text-blue hover:underline inline-flex items-center mx-2"
            to="/key"
          >
            <Key className="mr-1" />
            Key page
          </Link>
          to load a private key.
        </div>
      </div>
    );
  }
  if (status === 'registered_key_disabled') {
    return (
      <div className="flex grow flex-row flex-wrap items-center">
        <div className="bg-red text-white font-extrabold rounded-full px-2 py-1 mx-3">
          disabled
        </div>
        <div className="text-lg inline-flex items-center mx-3">
          Please contact the
          <Link
            className="text-blue hover:underline inline-flex items-center mx-2"
            to="/docs/contact"
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
          onClick={() => dropKey()}
        >
          <XCircle className="mr-2" />
          Unload
        </button>
      </div>
    </div>
  );
}
