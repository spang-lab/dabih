import {
  open,
  access,
  mkdir,
  rename,
  rm,
  constants,
  writeFile,
  stat,
} from 'node:fs/promises';
import {
  resolve,
  join,
} from 'node:path';
import { log, requireEnv } from '../util/index.js';


let basePath = null;

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


const get = async (bucket, key) => {
  const path = join(basePath, bucket, key);
  try {
    const file = await open(path, 'r')
    return file.createReadStream();
  } catch (err) {
    log.error(err);
    throw new Error(`FS: Failed to open file ${path}`);
  }
};

const store = async (bucket, key) => {
  const path = join(basePath, bucket, key);
  try {
    const file = await open(path, 'w');
    return file.createWriteStream();
  } catch (err) {
    log.error(err);
    throw new Error(`Failed to write to file ${path}`);
  }

};

const head = async (bucket, key) => {
  const path = join(basePath, bucket, key);
  try {
    const meta = await stat(path);
  } catch (err) {
    return null;
  }
};

const removeBucket = async (bucket) => {
  const path = join(basePath, bucket);
  if (!await exists(path)) {
    return;
  }
  await rm(path, { recursive: true });
}

const createBucket = async (bucket) => {
  const path = join(basePath, bucket);
  await mkdir(path);
}


const init = async () => {
  const storageUrl = requireEnv('STORAGE_URL');
  const [, path] = storageUrl.split(':', 2);
  if (!path) {
    throw new Error('local storage provider needs config.storage.path');
  }
  basePath = resolve(path);
  if (!await exists(basePath)) {
    throw new Error(`storage.path "${basePath}" does not exist`);
  }
  if (!await isWriteable(basePath)) {
    throw new Error(`No write permission for storage.path "${basePath}"`);
  }
  log.log(`Writing data to ${basePath}`);

  return {
    get,
    store,
    head,
    removeBucket,
    createBucket,
  }
}
export default init;
