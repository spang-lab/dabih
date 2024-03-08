import { dataset } from '../../database/index.js';

const route = async (ctx) => {
  const { isAdmin } = ctx.data;
  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }
  if (!isAdmin) {
    ctx.error('Only admins can recover datasets', 400);
    return;
  }
  await dataset.recover(ctx, mnemonic);
  ctx.body = 'ok';
};
export default route;
