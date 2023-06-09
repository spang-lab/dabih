import React, { useEffect, useState } from 'react';
import { storage, isCryptoApiAvailable } from '../../lib';
import { Link } from '../util';

export default function BrowserSupport() {
  const [hasCrypto, setCrypto] = useState(true);
  const [hasStorage, setStorage] = useState(true);

  useEffect(() => {
    setCrypto(isCryptoApiAvailable());
    setStorage(storage.isAvailable());
  }, []);

  const storageError = () => {
    if (hasStorage) {
      return null;
    }
    return (
      <div
        className="relative p-3 m-3 text-xl font-semibold text-center text-danger bg-red-100 rounded-lg"
        role="alert"
      >
        <p className="p-2 text-2xl font-bold">
          Dabih will not work with this browser
        </p>
        Web Storage API is not supported. Dabih needs this API to store private
        keys.
        <p>
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API">
            More Info
          </Link>
        </p>
      </div>
    );
  };
  const cryptoError = () => {
    if (hasCrypto) {
      return null;
    }
    return (
      <div
        className="relative p-3 m-3 text-xl font-semibold text-center text-danger bg-red-100 rounded-lg"
        role="alert"
      >
        <p className="p-2 text-2xl font-bold">
          Dabih will not work with this browser
        </p>
        Web Crypto API is not supported or cannot be used (no SSL connection?).
        Dabih needs this API to decrypt the data.
        <p>
          <Link href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API">
            More Info
          </Link>
        </p>
      </div>
    );
  };

  return (
    <div>
      {storageError()}
      {cryptoError()}
    </div>
  );
}
