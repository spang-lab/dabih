/* eslint-disable no-await-in-loop */
import {
  base64ToUint8, sha256, aes, crc,
} from '../../crypto/index.js';
import { dataset } from '../../database/index.js';
import { getStorage } from '../../storage/index.js';
import { getSub, sendError } from '../../util/index.js';

const reencryptChunk = async (chunk, mnemonic, newMnemonic, oldKey, newKey) => {
  const storage = getStorage();
  const { hash, iv } = chunk;
  const rawIv = base64ToUint8(iv);
  const file = await storage.open(mnemonic, hash);
  const target = await storage.create(newMnemonic, hash);
  const readStream = file.createReadStream();
  const writeStream = target.createWriteStream();
  const decrypt = aes.decryptStream(oldKey, rawIv);
  const encrypt = aes.encryptStream(newKey, rawIv);
  const crcStream = crc.createStream();
  const hashStream = sha256.createStream();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      const newHash = hashStream.digest('base64');
      if (newHash !== hash) {
        reject(new Error(`Hash mismatch in chunk ${newHash} != ${hash}`));
        return;
      }
      resolve({
        ...chunk,
        crc: crcStream.digest('hex'),
      });
    });
    readStream
      .pipe(decrypt)
      .pipe(hashStream)
      .pipe(encrypt)
      .pipe(crcStream)
      .pipe(writeStream);
  });
};

const route = async (ctx) => {
  const sub = getSub(ctx);

  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    sendError(ctx, 'No mnemonic', 400);
    return;
  }
  const info = await dataset.fromMnemonic(ctx, mnemonic);

  const permission = await dataset.getMemberAccess(ctx, mnemonic, sub);
  if (permission !== 'write') {
    sendError(ctx, 'You do not have permission to reencrypt', 400);
    return;
  }
  const { key } = ctx.request.body;

  const aesKey = base64ToUint8(key);
  const keyHash = sha256.hash(aesKey);
  if (info.keyHash !== keyHash) {
    sendError(ctx, 'Invalid AES Key', 400);
    return;
  }
  const chunks = await dataset.listChunks(ctx, mnemonic);
  const newMnemonic = `${mnemonic}_reencrypt`;
  const newKey = await aes.randomKey();
  const newKeyHash = sha256.hash(newKey);

  const newChunks = [];
  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    const newChunk = await reencryptChunk(chunk, mnemonic, newMnemonic, aesKey, newKey);
    newChunks.push(newChunk);
  }

  const promises = newChunks.map((c) => dataset.updateChunk(ctx, c.id, { crc: c.crc }));
  await Promise.all(promises);
  await dataset.update(ctx, mnemonic, {
    keyHash: newKeyHash,
  });
  await dataset.destroyKeys(ctx, mnemonic);
  await dataset.addKeys(ctx, mnemonic, newKey);

  const storage = getStorage();
  await storage.destroyDataset(mnemonic);
  await storage.move(newMnemonic, mnemonic);

  ctx.body = 'ok';
};
export default route;
