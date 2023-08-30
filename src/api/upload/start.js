import {
  dataset,
} from '../../database/index.js';
import { getSub } from '../../util/index.js';
import { aes, sha256 } from '../../crypto/index.js';
import { aesKey } from '../../ephemeral/index.js';

const getNames = (ctx) => {
  const { body } = ctx.request;
  if (!body) {
    return null;
  }
  const {
    name,
    fileName,
  } = body;
  return {
    name,
    fileName,
  };
};

const route = async (ctx) => {
  const sub = getSub(ctx);
  const {
    name,
    fileName,
  } = getNames(ctx);
  const key = await aes.randomKey();
  const keyHash = sha256.hash(key);

  const dbDataset = await dataset.create(ctx, {
    keyHash,
    createdBy: sub,
    fileName,
    name,
  });
  const { mnemonic } = dbDataset;
  await dataset.addMember(ctx, mnemonic, sub, 'write');
  await aesKey.store(mnemonic, key);
  await dataset.addKeys(ctx, mnemonic, key);

  ctx.body = dbDataset;
};
export default route;
