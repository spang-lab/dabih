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
    ctx.body = {
      valid: false,
      error: `Key with hash ${keyHash} is not registered for your account ${sub}`,
    };
    return;
  }
  if (!key.confirmed) {
    ctx.body = {
      valid: false,
      error: `Key with hash ${keyHash} has not been confirmed by an admin yet.`,
    };
    return;
  }
  ctx.body = { valid: true };
};
export default route;
