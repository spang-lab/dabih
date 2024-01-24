import { literal } from 'sequelize';
import { sendError, getUser, userHasScope } from '../../util/index.js';
import { rsa } from '../../crypto/index.js';
import { publicKey } from '../../database/index.js';

const route = async (ctx) => {
  const user = getUser(ctx);
  const isAdmin = userHasScope(ctx, 'admin');
  const { sub, name, email } = user;
  const { body } = ctx.request;
  const pubKey = body.publicKey;
  if (!pubKey) {
    sendError(ctx, 'No public key in body');
    return;
  }
  const hash = rsa.hashKey(pubKey);

  const keyData = {
    hash,
    name,
    sub,
    email,
    data: pubKey,
    isRootKey: false,
  };
  if (isAdmin) {
    keyData.confirmedBy = sub;
    keyData.confirmed = literal('CURRENT_TIMESTAMP');
  }

  await publicKey.add(ctx, keyData);
  ctx.body = { data: 'ok' };
};
export default route;
