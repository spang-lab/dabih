import { sendError, getUser } from '../../util/index.js';
import { rsa } from '../../crypto/index.js';
import { publicKey } from '../../database/index.js';

const route = async (ctx) => {
  const { sub, name } = getUser(ctx);
  const { body } = ctx.request;
  const pubKey = body.publicKey;
  if (!pubKey) {
    sendError(ctx, 'No public key in body');
    return;
  }
  const hash = rsa.hashKey(pubKey);
  await publicKey.add(ctx, {
    hash,
    name,
    sub,
    data: pubKey,
    isRootKey: false,
  });
  ctx.body = { data: 'ok' };
};
export default route;
