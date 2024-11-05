import Piscina from 'piscina';
import { resolve } from 'path';

export const searchWorker = new Piscina({
  filename: resolve(import.meta.dirname, './wrapper.cjs'),
  workerData: {
    path: resolve(import.meta.dirname, './search.ts'),
  },
});
