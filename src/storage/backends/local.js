import {
  open,
  access,
  mkdir,
  rename,
  rm,
  constants,
} from 'node:fs/promises';
import {
  resolve,
  join,
} from 'node:path';
import {
  base64ToBase64Url,
} from '../../crypto/index.js';

import { getConfig, log } from '../../util/index.js';

const exists = async (path) => {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};
const isWriteable = async (path) => {
  try {
    await access(path, constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
};
const mkdirNx = async (folderPath) => {
  if (await exists(folderPath)) {
    return;
  }
  await mkdir(folderPath);
};

const getBasePath = async () => {
  const { storage } = getConfig();
  const { path } = storage;
  if (!path) {
    throw new Error('local storage provider needs config.storage.path');
  }
  const basePath = resolve(path);
  if (!await exists(basePath)) {
    throw new Error(`storage.path "${basePath}" does not exist`);
  }
  if (!await isWriteable(basePath)) {
    throw new Error(`No write permission for storage.path "${basePath}"`);
  }
  return basePath;
};

const init = async () => {
  const basePath = await getBasePath();
  const resolveId = (mnemonic, chunkHash) => {
    const folder = join(basePath, mnemonic);
    const fileName = base64ToBase64Url(chunkHash);
    const path = join(folder, fileName);
    return {
      folder,
      fileName,
      path,
    };
  };

  const create = async (mnemonic, chunkHash) => {
    const { folder, path } = resolveId(mnemonic, chunkHash);
    try {
      await mkdirNx(folder);
      const file = await open(path, 'w');
      return file;
    } catch (err) {
      log.error(err);
      throw new Error(`Failed to create file ${path}`);
    }
  };
  const move = async (mnemonic, newMnemonic) => {
    const folder = join(basePath, mnemonic);
    if (!await exists(folder)) {
      return;
    }
    const target = join(basePath, newMnemonic);
    if (await exists(target)) {
      throw new Error(`${target} already exists`);
    }
    await rename(folder, target);
  };

  const chunkExists = async (mnemonic, chunkHash) => {
    const { path } = resolveId(mnemonic, chunkHash);
    return exists(path);
  };

  const openChunk = async (mnemonic, chunkHash) => {
    const { path } = resolveId(mnemonic, chunkHash);
    try {
      const file = await open(path, 'r');
      return file;
    } catch (err) {
      log.error(err);
      throw new Error(`Failed to open chunk file ${path}`);
    }
  };

  const close = async (file) => {
    file.close();
  };

  const destroyDataset = async (mnemonic) => {
    const folder = join(basePath, mnemonic);
    if (!await exists(folder)) {
      return;
    }
    await rm(folder, { recursive: true });
  };

  return {
    create,
    move,
    open: openChunk,
    exists: chunkExists,
    destroyDataset,
    close,
  };
};

export default init;
