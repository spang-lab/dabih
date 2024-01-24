import { dataset } from '../../database/index.js';
import { sendError, userHasScope } from '../../util/index.js';

const route = async (ctx) => {
  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    sendError(ctx, 'No mnemonic', 400);
    return;
  }
  if (!userHasScope(ctx, 'admin')) {
    sendError(ctx, 'Only admins can recover datasets', 400);
    return;
  }
  await dataset.recover(ctx, mnemonic);
  ctx.body = 'ok';
};
export default route;
