import Piscina from 'piscina';
import { resolve } from 'path';

const dirname = import.meta.dirname || __dirname;

export const searchWorker = new Piscina({
  filename: resolve(dirname, './wrapper.cjs'),
  workerData: {
    path: resolve(dirname, './search.ts'),
  },
});
