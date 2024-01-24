import { getSub, sendError } from '../../util/index.js';
import { token } from '../../database/index.js';

const route = async (ctx) => {
  const { body } = ctx.request;
  const { tokenId } = body;

  const sub = getSub(ctx);

  if (!tokenId) {
    sendError(ctx, 'No token in request body', 400);
    return;
  }
  await token.destroy(ctx, { id: tokenId, sub });

  ctx.body = 'ok';
};
export default route;
