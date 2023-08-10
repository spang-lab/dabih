import { literal } from 'sequelize';
import { getUser, sendError } from '../../util/index.js';
import { randomToken } from '../../crypto/index.js';
import { token } from '../../database/index.js';

const route = async (ctx) => {
  const user = getUser(ctx);
  const { sub, name, email } = user;
  const n = 32;

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

  const tokenString = await randomToken(n);
  await token.add(ctx, {
    token: tokenString,
    lifetime: 3 * oneDay,
    timestamp: literal('CURRENT_TIMESTAMP'),
    sub,
    name,
    email,
    scopes: [type],
  });
  ctx.body = {
    data: tokenString,
    type,
  };
};
export default route;
