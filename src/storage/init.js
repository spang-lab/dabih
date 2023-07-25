import { getConfig } from '../util/index.js';
import { initLocal } from './backends/index.js';

let storageProvider = null;

export const initStorage = async () => {
  const { storage } = getConfig();
  const { backend } = storage;
  if (backend === 'local') {
    storageProvider = await initLocal();
    return;
  }
  throw new Error(`Invalid storage provider backend "${backend}".
    Currently, only  "local" is implemented.`);
};

export const getStorage = () => {
  if (storageProvider === null) {
    throw new Error('storageProvider uninitialized. Call initStorage first.');
  }
  return storageProvider;
};
