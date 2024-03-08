import {
  dataset,
} from '../../database/index.js';
import { aes, sha256 } from '../../crypto/index.js';
import { storeKey } from '../../ephemeral/index.js';

const route = async (ctx) => {
  const { sub } = ctx.data;
  const { body } = ctx.request;
  const {
    name,
    fileName,
    path,
    size,
    chunkHash,
  } = body;
  if (!fileName) {
    ctx.error('body.fileName is undefined', 400);
    return;
  }

  const duplicate = await dataset.findDuplicate(ctx, sub, fileName, size, chunkHash);

  const key = await aes.randomKey();
  const keyHash = sha256.hash(key);

  const dbDataset = await dataset.create(ctx, {
    keyHash,
    createdBy: sub,
    fileName,
    path,
    size,
    name,
  });
  const { mnemonic } = dbDataset;
  await dataset.addMember(ctx, mnemonic, sub, 'write');
  await storeKey(mnemonic, key);
  await dataset.addKeys(ctx, mnemonic, key);

  if (duplicate) {
    dbDataset.duplicate = duplicate;
  }

  ctx.body = dbDataset;
};
export default route;
