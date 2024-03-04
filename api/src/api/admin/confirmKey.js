import { literal } from 'sequelize';
import { publicKey } from '../../database/index.js';
import { getSub } from '../../util/index.js';

const route = async (ctx) => {
  const { keyId, confirmed } = ctx.request.body;
  if (!keyId) {
    ctx.error('No key id', 400);
    return;
  }
  const sub = getSub(ctx);

  if (confirmed) {
    await publicKey.update(ctx, keyId, {
      confirmedBy: sub,
      confirmed: literal('CURRENT_TIMESTAMP'),
    });
    ctx.body = 'ok';
    return;
  }
  await publicKey.update(ctx, keyId, {
    confirmedBy: null,
    confirmed: null,
  });
  ctx.body = 'ok';
};
export default route;
