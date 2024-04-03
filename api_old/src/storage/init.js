import { requireEnv, parseUrl } from '../util/index.js';
import { initLocal } from './backends/index.js';
import initFs from './fs.js';

let storage = null;

export const initStorage = async () => {
  const storageUrl = requireEnv('STORAGE_URL');
  const { backend, path } = parseUrl(storageUrl);
  if (backend === 'local') {
    storage = await initLocal();
    return;
  }
  if (backend === 'fs') {
    storage = await initFs();
    return;
  }
  throw new Error(`Invalid storage provider backend "${backend}".
    Currently, only  "local" is implemented.`);
};

export const getStorage = () => {
  if (storage === null) {
    throw new Error('storageProvider uninitialized. Call initStorage first.');
  }
  return storage;
};
