import { publicKey } from '../../database/index.js';

const route = async (ctx) => {
  const { sub } = ctx.data;
  const { keyHash } = ctx.request.body;
  if (!keyHash) {
    const keys = await publicKey.list(ctx, {
      sub,
      isRootKey: false,
    });
    if (keys.length === 0) {
      ctx.body = {
        status: 'unregistered',
        error: `User ${sub} has no registered keys`,
      };
      return;
    }
    ctx.body = {
      status: 'unloaded',
      error: `User ${sub} has a public key, but no keyHash was provided in the body.`,
    };
    return;
  }
  const key = await publicKey.find(ctx, {
    sub,
    hash: keyHash,
  });

  if (!key) {
    ctx.body = {
      status: 'invalid',
      error: `Key with hash ${keyHash} is not registered for the account ${sub}`,
    };
    return;
  }
  if (!key.enabled) {
    ctx.body = {
      status: 'disabled',
      error: `Key with hash ${keyHash} has not been enabled by an admin yet.`,
    };
    return;
  }
  ctx.body = {
    status: 'active',
  };
};
export default route;
