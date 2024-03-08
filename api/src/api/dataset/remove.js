import { dataset } from '../../database/index.js';

const isAllowed = async (ctx, mnemonic) => {
  const { sub, isAdmin } = ctx.data;
  if (isAdmin) {
    return true;
  }
  const permission = await dataset.getMemberAccess(ctx, mnemonic, sub);
  return permission === 'write';
};

const route = async (ctx) => {
  const { mnemonic } = ctx.params;

  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }
  if (!await isAllowed(ctx, mnemonic)) {
    ctx.error('You do not have permission to remove the dataset', 400);
    return;
  }

  await dataset.remove(ctx, mnemonic);
  ctx.body = 'ok';
};
export default route;
