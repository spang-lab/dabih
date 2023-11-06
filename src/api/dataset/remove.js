import { dataset } from '../../database/index.js';
import { getSub, sendError, userHasScope } from '../../util/index.js';

const isAllowed = async (ctx, mnemonic) => {
  if (userHasScope(ctx, 'admin')) {
    return true;
  }
  const sub = getSub(ctx);
  const permission = await dataset.getMemberAccess(ctx, mnemonic, sub);
  return permission === 'write';
};

const route = async (ctx) => {
  const { mnemonic } = ctx.params;

  if (!mnemonic) {
    sendError(ctx, 'No mnemonic', 400);
    return;
  }
  if (!await isAllowed(ctx, mnemonic)) {
    sendError(ctx, 'You do not have permission to remove the dataset', 400);
    return;
  }

  await dataset.remove(ctx, mnemonic);
  ctx.body = 'ok';
};
export default route;
