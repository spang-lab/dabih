import { sha256 } from '../../crypto/index.js';
import { dataset } from '../../database/index.js';

const route = async (ctx) => {
  const { sub } = ctx.data;

  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }
  const info = await dataset.fromMnemonic(ctx, mnemonic);
  const permission = await dataset.getMemberAccess(ctx, mnemonic, sub);
  if (permission !== 'write') {
    ctx.error('You do not have permission to add members', 400);
    return;
  }
  const { member, members, key } = ctx.request.body;
  const memberList = members || [];
  if (member) {
    memberList.push(member);
  }
  const keyHash = sha256.hashKey(key);
  if (info.keyHash !== keyHash) {
    ctx.error('Invalid AES Key', 400);
    return;
  }
  const promises = memberList.map(async (user) => {
    await dataset.addMember(ctx, mnemonic, user, 'read');
  });
  await Promise.all(promises);
  await dataset.addKeys(ctx, mnemonic, key);
  ctx.body = 'ok';
};
export default route;
