
import { useEffect, useState } from 'react';
import api from '@/lib/api';


function checkLocalStorage() {
  try {
    const storage = window.localStorage;
    const testKey = "__storage_test__";
    const testData = "__storage_test__";
    storage.setItem(testKey, testData);
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

async function checkOPFS() {
  if (!navigator.storage) {
    return false;
  }
  const root = await navigator.storage?.getDirectory();
  if (!root) {
    return false;
  }
  return true;
}

async function checkApi() {
  const { data } = await api.util.healthy();
  return data?.healthy ?? false;
}
function checkCrypto() {
  return !!crypto && !!crypto.subtle;
}






export default function BrowserSupport() {
  const [hasCrypto, setCrypto] = useState(true);
  const [hasStorage, setStorage] = useState(true);
  const [hasOPFS, setOPFS] = useState(true);
  const [hasApi, setApi] = useState(true);

  useEffect(() => {
    (async () => {
      setStorage(checkLocalStorage());
      setCrypto(checkCrypto());
      setApi(await checkApi());
      setOPFS(await checkOPFS());
    })().catch(console.error);
  }, []);

  const storageError = () => {
    if (hasStorage) {
      return null;
    }
    return (
      <div
        className="relative p-3 m-3 text-xl font-semibold text-center text-red bg-red/20 rounded-lg"
        role="alert"
      >
        <p className="p-2 text-2xl font-bold">
          Dabih will not work with this browser
        </p>
        Web Storage API is not supported. Dabih needs this API to store private
        keys.
        <p>

          <a
            className="text-blue hover:underline"
            href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API"
            target="_blank"
            rel="noopener noreferrer"
          >
            More Info
          </a>
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
        className="relative p-3 m-3 text-xl font-semibold text-center text-red bg-red/20 rounded-lg"
        role="alert"
      >
        <p className="p-2 text-2xl font-bold">
          Dabih will not work with this browser
        </p>
        Web Crypto API is not supported or cannot be used (no SSL connection?).
        Dabih needs this API to decrypt the data.
        <p>
          <a
            className="text-blue hover:underline"
            href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API"
            target="_blank"
            rel="noopener noreferrer"
          >
            More Info
          </a>
        </p>
      </div>
    );
  };

  const apiError = () => {
    if (hasApi) {
      return null;
    }
    return (
      <div
        className="relative p-3 m-3 text-xl font-semibold text-center text-red bg-red/20 rounded-lg"
        role="alert"
      >
        <span className="p-2 text-2xl font-bold">
          Connection Error:
        </span>
        The Dabih API is not available, please contact the administrator.
      </div>
    );
  }
  const opfsError = () => {
    if (hasOPFS) {
      return null;
    }
    return (
      <div
        className="relative p-3 m-3 text-xl font-semibold text-center text-red bg-red/20 rounded-lg"
        role="alert"
      >
        <p className="p-2 text-2xl font-bold">
          Dabih will not work with this browser
        </p>
        The Origin private file system API is not supported. Dabih needs this API to download files.
        <p>
          <a
            className="text-blue hover:underline"
            href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system"
            target="_blank"
            rel="noopener noreferrer"
          >
            More Info
          </a>
        </p>
      </div>
    );
  }


  return (
    <div>
      {storageError()}
      {cryptoError()}
      {apiError()}
      {opfsError()}
    </div>
  );
}
