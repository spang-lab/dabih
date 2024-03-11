import { literal } from 'sequelize';
import { publicKey } from '../../database/index.js';

const route = async (ctx) => {
  const { keyId, enabled } = ctx.request.body;
  if (!keyId) {
    ctx.error('No key id', 400);
    return;
  }
  const { sub, isAdmin } = ctx.data;

  if (!isAdmin) {
    ctx.error('Only Admins can enable keys', 401);
    return;
  }

  if (enabled) {
    await publicKey.update(ctx, keyId, {
      enabledBy: sub,
      enabled: literal('CURRENT_TIMESTAMP'),
    });
    ctx.body = 'ok';
    return;
  }
  await publicKey.update(ctx, keyId, {
    enabledBy: null,
    enabled: null,
  });
  ctx.body = 'ok';
};
export default route;
