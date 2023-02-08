import { publicKey } from '../../database/index.js';
import { sendError } from '../../util/index.js';

const route = async (ctx) => {
  const { keyId } = ctx.request.body;
  if (!keyId) {
    sendError(ctx, 'No key id', 400);
    return;
  }
  await publicKey.remove(ctx, keyId);
  ctx.body = 'ok';
};
export default route;
