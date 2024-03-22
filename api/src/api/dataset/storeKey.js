import { dataset } from '../../database/index.js';
import { sha256 } from '../../crypto/index.js';
import { storeKey } from '../../ephemeral/index.js';

const route = async (ctx) => {
  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }
  const { key } = ctx.request.body;
  const info = await dataset.fromMnemonic(ctx, mnemonic);
  const keyHash = sha256.hashKey(key);
  if (info.keyHash !== keyHash) {
    ctx.error('Invalid AES Key', 400);
    return;
  }
  storeKey(mnemonic, key);

  ctx.body = { ok: true };
};
export default route;
