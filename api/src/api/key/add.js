import { literal } from 'sequelize';
import { rsa } from '../../crypto/index.js';
import { publicKey } from '../../database/index.js';

const route = async (ctx) => {
  const { sub, isAdmin } = ctx.data;
  const { body } = ctx.request;
  const pubKey = body.publicKey;
  const { name, email } = body;

  const isRootKey = !!body.rootKey;
  if (!pubKey) {
    ctx.error('No public key in body');
    return;
  }
  if (!name || !email) {
    ctx.error('No name or email in body');
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
    keyData.enabledBy = sub;
    keyData.enabled = literal('CURRENT_TIMESTAMP');
    keyData.isRootKey = isRootKey;
  }

  await publicKey.add(ctx, keyData);
  ctx.body = { data: 'ok' };
};
export default route;
