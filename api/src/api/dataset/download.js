/* eslint-disable no-await-in-loop */
import { PassThrough } from 'node:stream';
import MultiStream from 'multistream';
import { aesKey } from '../../ephemeral/index.js';
import {
  base64ToUint8, aes,
} from '../../crypto/index.js';
import { dataset } from '../../database/index.js';
import { getStorage } from '../../storage/index.js';
import { sendError } from '../../util/index.js';

const writeChunk = async (stream, mnemonic, chunk, key) => {
  const storage = getStorage();
  const { hash, iv } = chunk;
  const rawIv = base64ToUint8(iv);
  const file = await storage.open(mnemonic, hash);
  const readStream = file.createReadStream();
  const decrypt = aes.decryptStream(key, rawIv);

  return new Promise((resolve) => {
    readStream.on('end', () => {
      resolve();
    });
    readStream
      .pipe(decrypt)
      .pipe(stream, { end: false });
  });
};

const tmp = async () => {
  let combined = new PassThrough();

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const { hash, iv } = chunk;
    const rawIv = base64ToUint8(iv);
    const file = await storage.open(mnemonic, hash);
    const readStream = file.createReadStream();
    const decrypt = aes.decryptStream(key, rawIv);
    const isLastChunk = i === chunks.length - 1;
    const decrypted = readStream.pipe(decrypt);

    combined = decrypted.pipe(combined, { end: isLastChunk });
  }
};

const route = async (ctx) => {
  const storage = getStorage();
  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    sendError(ctx, 'No mnemonic', 400);
    return;
  }

  const key = await aesKey.get(mnemonic, 0);
  if (!key) {
    sendError(ctx, 'Failed to load aes key from emphermal storage', 500);
    return;
  }

  const info = await dataset.fromMnemonic(ctx, mnemonic);
  const { fileName, size } = info;
  const chunks = await dataset.listChunks(ctx, mnemonic);

  const promises = chunks.map(async (chunk) => {
    const { hash, iv } = chunk;
    const rawIv = base64ToUint8(iv);
    const file = await storage.open(mnemonic, hash);
    const readStream = file.createReadStream();
    const decrypt = aes.decryptStream(key, rawIv);
    return readStream.pipe(decrypt);
  });
  const streams = await Promise.all(promises);
  const combined = new MultiStream(streams);

  ctx.set('Content-Length', size);
  ctx.set('Content-Type', 'application/octet-stream');
  ctx.attachment(fileName);
  ctx.body = combined;
};
export default route;
