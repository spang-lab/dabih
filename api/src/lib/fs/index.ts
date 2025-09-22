import { requireEnv } from '#lib/env';
import { Stats, WriteStream } from 'node:fs';
import initFilesystem from './fs';
import { Readable } from 'node:stream';

export interface StorageBackend {
  get: (bucket: string, key: string) => Promise<Readable>;
  store: (bucket: string, key: string) => Promise<WriteStream>;
  head: (bucket: string, key: string) => Promise<Stats | null>;
  removeBucket: (bucket: string) => Promise<void>;
  createBucket: (bucket: string) => Promise<void>;
  listBuckets: () => Promise<string[]>;
}

let backend: StorageBackend | null = null;

export const init = async () => {
  const storageUrl = requireEnv('STORAGE_URL');

  if (storageUrl.startsWith('fs:')) {
    const [, path] = storageUrl.split('fs:', 2);
    backend = await initFilesystem(path);
    return;
  }

  throw new Error(`Invalid storage uri "${storageUrl}"`);
};

export const get = (bucket: string, key: string) => {
  if (!backend) {
    throw new Error('Storage backend not initialized');
  }
  return backend.get(bucket, key);
};
export const store = (bucket: string, key: string) => {
  if (!backend) {
    throw new Error('Storage backend not initialized');
  }
  return backend.store(bucket, key);
};
export const head = (bucket: string, key: string) => {
  if (!backend) {
    throw new Error('Storage backend not initialized');
  }
  return backend.head(bucket, key);
};
export const removeBucket = (bucket: string) => {
  if (!backend) {
    throw new Error('Storage backend not initialized');
  }
  return backend.removeBucket(bucket);
};
export const createBucket = (bucket: string) => {
  if (!backend) {
    throw new Error('Storage backend not initialized');
  }
  return backend.createBucket(bucket);
};

export const listBuckets = () => {
  if (!backend) {
    throw new Error('Storage backend not initialized');
  }
  return backend.listBuckets();
};
