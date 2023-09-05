import { sendError } from '../../util/index.js';
import { token } from '../../database/index.js';

const route = async (ctx) => {
  const oneMinute = 60 * 1000;
  const oneDay = 24 * 60 * oneMinute;
  const { type } = ctx.params;

  const vTypes = ['api', 'upload'];
  if (!vTypes.includes(type)) {
    sendError(
      ctx,
      `Invalid token scope ${type}, must be one of [${vTypes.join(', ')}]`,
      400,
    );
    return;
  }
  const result = await token.generate(ctx, {
    lifetime: 3 * oneDay,
    scopes: [type],
    refresh: true,
  });

  ctx.body = result;
};
export default route;
