import { sendError, getSub } from '../../util/index.js';
import { publicKey } from '../../database/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);
  const { keyHash } = ctx.request.body;
  if (!keyHash) {
    sendError(ctx, 'No key hash in body');
    return;
  }
  const key = await publicKey.find(ctx, {
    sub,
    hash: keyHash,
  });

  if (!key) {
    sendError(ctx, `Key with hash ${keyHash} is not registered for your account ${sub}`, 400);
    return;
  }
  if (!key.confirmed) {
    sendError(ctx, `Key with hash ${keyHash} has not been confirmed by an admin yet.`, 400);
    return;
  }
  ctx.body = { valid: true };
};
export default route;
