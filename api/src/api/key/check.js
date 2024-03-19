import { publicKey } from '../../database/index.js';

const route = async (ctx) => {
  const { sub } = ctx.data;
  const { keyHash } = ctx.request.body;
  if (!keyHash) {
    ctx.error('No key hash in body');
    return;
  }
  const key = await publicKey.find(ctx, {
    sub,
    hash: keyHash,
  });

  if (!key) {
    ctx.body = {
      isValid: false,
      error: `Key with hash ${keyHash} is not registered for your account ${sub}`,
    };
    return;
  }
  if (!key.enabled) {
    ctx.body = {
      isValid: false,
      error: `Key with hash ${keyHash} has not been confirmed by an admin yet.`,
    };
    return;
  }
  ctx.body = { isValid: true };
};
export default route;
