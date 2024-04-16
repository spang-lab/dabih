import {
  open,
  access,
  mkdir,
  rm,
  constants,
  stat,
} from 'node:fs/promises';
import {
  resolve,
  join,
} from 'node:path';
import logger from '#lib/logger';
import { requireEnv } from '#lib/env';


let basePath = '';

const exists = async (path: string) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

const isWriteable = async (path: string) => {
  try {
    await access(path, constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};


export const get = async (bucket: string, key: string) => {
  const path = join(basePath, bucket, key);
  try {
    const file = await open(path, 'r')
    return file.createReadStream();
  } catch (err) {
    logger.error(err);
    throw new Error(`FS: Failed to open file ${path}`);
  }
};

export const store = async (bucket: string, key: string) => {
  const path = join(basePath, bucket, key);
  try {
    const file = await open(path, 'w');
    return file.createWriteStream();
  } catch (err) {
    logger.error(err);
    throw new Error(`Failed to write to file ${path}`);
  }
};

export const head = async (bucket: string, key: string) => {
  const path = join(basePath, bucket, key);
  try {
    const meta = await stat(path);
    return meta;
  } catch (err) {
    return null;
  }
};

export const removeBucket = async (bucket: string) => {
  const path = join(basePath, bucket);
  if (!await exists(path)) {
    return;
  }
  await rm(path, { recursive: true });
}

export const createBucket = async (bucket: string) => {
  const path = join(basePath, bucket);
  await mkdir(path);
}


export const initFilesystem = async () => {
  const storageUrl = requireEnv('STORAGE_URL');
  const [backend, path] = storageUrl.split(':', 2);
  if (backend !== 'fs') {
    throw new Error(`Invalid storage backend "${backend}", options are "fs"`);
  }
  if (!path) {
    throw new Error('fs storage provider needs config.storage.path');
  }
  basePath = resolve(path);
  if (!await exists(basePath)) {
    logger.warn(`storage.path "${basePath}" does not exist, trying to create it`);
    try {
      await mkdir(basePath, { recursive: true });
    } catch (err) {
      throw new Error(`storage.path "${basePath}" does not exist and could not be created`);
    }
  }
  if (!await isWriteable(basePath)) {
    throw new Error(`No write permission for storage.path "${basePath}"`);
  }
  logger.info(`Writing data to ${basePath}`);
};

