import Piscina from 'piscina';
import { resolve } from 'path';
import { existsSync } from 'fs';

const dirname = import.meta.dirname || __dirname;

let filename = resolve(dirname, './search.cjs');
if (!existsSync(filename)) {
  filename = resolve(dirname, './wrapper.cjs');
}

export const searchWorker = new Piscina({
  filename,
  workerData: {
    path: resolve(dirname, './search.ts'),
  },
});
