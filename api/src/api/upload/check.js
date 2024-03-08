import { dataset } from '../../database/index.js';
import { readKey } from '../../ephemeral/index.js';

const route = async (ctx) => {
  const { sub } = ctx.data;

  const info = await dataset.findUpload(ctx, sub);
  if (!info) {
    ctx.body = null;
    return;
  }
  const { mnemonic } = info;
  const key = await readKey(mnemonic);
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
