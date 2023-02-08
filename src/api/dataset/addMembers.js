import { base64ToUint8, sha256 } from '../../crypto/index.js';
import { dataset } from '../../database/index.js';
import { getSub, sendError } from '../../util/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);

  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    sendError(ctx, 'No mnemonic', 400);
    return;
  }
  const info = await dataset.fromMnemonic(ctx, mnemonic);
  const permission = await dataset.getMemberAccess(ctx, mnemonic, sub);
  if (permission !== 'write') {
    sendError(ctx, 'You do not have permission to add members', 400);
    return;
  }
  const { members, key } = ctx.request.body;

  const aesKey = base64ToUint8(key);
  const keyHash = sha256.hash(aesKey);
  if (info.keyHash !== keyHash) {
    sendError(ctx, 'Invalid AES Key', 400);
    return;
  }
  const promises = members.map(async (user) => {
    await dataset.addMember(ctx, mnemonic, user, 'read');
  });
  await Promise.all(promises);
  await dataset.addKeys(ctx, mnemonic, aesKey);
  ctx.body = 'ok';
};
export default route;
