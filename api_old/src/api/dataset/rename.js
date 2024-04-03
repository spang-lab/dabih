import { dataset } from '../../database/index.js';

const route = async (ctx) => {
  const { sub } = ctx.data;

  const { mnemonic } = ctx.params;
  const { name } = ctx.request.body;

  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }
  const permission = await dataset.getMemberAccess(ctx, mnemonic, sub);
  if (permission !== 'write') {
    ctx.error('You do not have permission to rename the dataset', 400);
    return;
  }
  await dataset.update(ctx, mnemonic, { name });
  ctx.body = 'ok';
};
export default route;
