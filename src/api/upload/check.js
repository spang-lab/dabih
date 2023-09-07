import { dataset } from '../../database/index.js';
import { aesKey } from '../../ephemeral/index.js';
import { getUser } from '../../util/api.js';

const route = async (ctx) => {
  const { sub } = getUser(ctx);

  const info = await dataset.findUpload(ctx, sub);
  if (!info) {
    ctx.body = null;
    return;
  }
  const { mnemonic } = info;
  const key = await aesKey.get(mnemonic);
  if (!key) {
    ctx.body = null;
    return;
  }

  const chunks = await dataset.listChunks(ctx, mnemonic);

  ctx.body = {
    ...info,
    chunks,
  };
};
export default route;
