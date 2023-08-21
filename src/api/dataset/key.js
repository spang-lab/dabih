import { dataset, publicKey } from '../../database/index.js';
import { getSub, sendError } from '../../util/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);

  const { mnemonic } = ctx.params;
  const { keyHash } = ctx.request.body;

  if (!mnemonic) {
    sendError(ctx, 'No mnemonic', 400);
    return;
  }
  const pubKey = await publicKey.find(ctx, {
    sub,
    hash: keyHash,
  });
  if (!pubKey) {
    sendError(ctx, `User ${sub} has no key with hash ${keyHash}`);
    return;
  }
  try {
    const { key } = await dataset.findKey(ctx, mnemonic, pubKey.id);
    ctx.body = key;
  } catch (err) {
    sendError(ctx, `Dataset ${mnemonic} key does not match pubKey ${keyHash}`);
  }
};
export default route;
