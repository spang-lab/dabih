import { dataset, publicKey } from '../../database/index.js';
import { getSub } from '../../util/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);

  const { mnemonic } = ctx.params;
  const { keyHash } = ctx.request.body;

  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }
  try {
    await dataset.fromMnemonic(ctx, mnemonic);
  } catch (err) {
    ctx.error(`Dataset ${mnemonic} does not exist`);
    return;
  }

  const pubKey = await publicKey.find(ctx, {
    sub,
    hash: keyHash,
  });
  if (!pubKey) {
    ctx.error(`User ${sub} has no key with hash ${keyHash}`);
    return;
  }

  try {
    const { key } = await dataset.findKey(ctx, mnemonic, pubKey.id);
    ctx.body = key;
  } catch (err) {
    ctx.error(`Dataset ${mnemonic} key does not match pubKey ${keyHash}`);
  }
};
export default route;
