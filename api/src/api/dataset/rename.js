import { dataset } from '../../database/index.js';
import { getSub, sendError } from '../../util/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);

  const { mnemonic } = ctx.params;
  const { name } = ctx.request.body;

  if (!mnemonic) {
    sendError(ctx, 'No mnemonic', 400);
    return;
  }
  const permission = await dataset.getMemberAccess(ctx, mnemonic, sub);
  if (permission !== 'write') {
    sendError(ctx, 'You do not have permission to rename the dataset', 400);
    return;
  }
  await dataset.update(ctx, mnemonic, { name });
  ctx.body = 'ok';
};
export default route;
