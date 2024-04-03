import { token } from '../../database/index.js';

const route = async (ctx) => {
  const { body } = ctx.request;
  const { tokenId } = body;

  const { sub } = ctx.data;

  if (!tokenId) {
    ctx.error('No token in request body', 400);
    return;
  }
  await token.destroy(ctx, { id: tokenId, sub });

  ctx.body = 'ok';
};
export default route;
