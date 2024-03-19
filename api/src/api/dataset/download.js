/* eslint-disable no-await-in-loop */
import MultiStream from 'multistream';
import {
  aes,
} from '../../crypto/index.js';
import { dataset } from '../../database/index.js';
import { getStorage } from '../../storage/index.js';
import { readKey } from '../../ephemeral/index.js';

const route = async (ctx) => {
  const storage = getStorage();
  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }

  const key = await readKey(mnemonic);
  if (!key) {
    ctx.error('Failed to load aes key from emphermal storage', 500);
    return;
  }

  const info = await dataset.fromMnemonic(ctx, mnemonic);
  const { fileName, size } = info;
  const chunks = await dataset.listChunks(ctx, mnemonic);

  const promises = chunks.map(async (chunk) => {
    const { hash, iv } = chunk;
    const file = await storage.open(mnemonic, hash);
    const readStream = file.createReadStream();
    const decrypt = aes.decryptStream(key, iv);
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
