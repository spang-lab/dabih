import {
  dataset,
} from '../../database/index.js';
import { getSub, sendError } from '../../util/index.js';
import { aes, sha256 } from '../../crypto/index.js';
import { aesKey } from '../../ephemeral/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);
  const { body } = ctx.request;
  const {
    name,
    fileName,
    size,
    chunkHash,
  } = body;
  if (!fileName) {
    sendError(ctx, 'body.fileName is undefined', 400);
    return;
  }

  const duplicate = await dataset.findDuplicate(ctx, sub, fileName, size, chunkHash);

  const key = await aes.randomKey();
  const keyHash = sha256.hash(key);

  const dbDataset = await dataset.create(ctx, {
    keyHash,
    createdBy: sub,
    fileName,
    size,
    name,
  });
  const { mnemonic } = dbDataset;
  await dataset.addMember(ctx, mnemonic, sub, 'write');
  await aesKey.store(mnemonic, key);
  await dataset.addKeys(ctx, mnemonic, key);

  if (duplicate) {
    dbDataset.duplicate = duplicate;
  }

  ctx.body = dbDataset;
};
export default route;
