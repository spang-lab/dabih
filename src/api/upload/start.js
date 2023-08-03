import {
  dataset,
  publicKey,
} from '../../database/index.js';
import { getSub, sendError } from '../../util/index.js';
import { aes, sha256 } from '../../crypto/index.js';
import { aesKey } from '../../ephemeral/index.js';

const getFileName = (ctx) => {
  const { body } = ctx.request;
  if (!body) {
    return null;
  }
  return body.name;
};

const route = async (ctx) => {
  const sub = getSub(ctx);
  const fileName = getFileName(ctx);
  const key = await aes.randomKey();
  const keyHash = sha256.hash(key);

  const pubKey = await publicKey.find(ctx, {
    sub,
    hash: keyHash,
  });
  if (!pubKey) {
    sendError(ctx, `Key with hash ${keyHash} is not registered for your account ${sub}`, 400);
    return;
  }
  if (!key.confirmed) {
    sendError(ctx, `Key with hash ${keyHash} has not been confirmed by an admin yet.`, 400);
    return;
  }

  const dbDataset = await dataset.create(ctx, {
    keyHash,
    createdBy: sub,
    fileName,
  });
  const { mnemonic } = dbDataset;
  await dataset.addMember(ctx, mnemonic, sub, 'write');
  await aesKey.store(mnemonic, key);
  await dataset.addKeys(ctx, mnemonic, key);

  ctx.body = dbDataset;
};
export default route;
