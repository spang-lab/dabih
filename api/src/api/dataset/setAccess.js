import { dataset } from '../../database/index.js';

const route = async (ctx) => {
  const { sub } = ctx.data;

  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    ctx.error('No mnemonic', 400);
    return;
  }
  const access = await dataset.getMemberAccess(ctx, mnemonic, sub);
  if (access !== 'write') {
    ctx.error('You do not have permission add members', 400);
    return;
  }
  const { member, permission } = ctx.request.body;

  const currentPermission = await dataset.getMemberAccess(ctx, mnemonic, member);
  if (currentPermission === 'write') {
    const members = await dataset.listMembers(ctx, mnemonic);
    const writers = members.map((m) => m.permission === 'write');

    if (writers.length <= 1) {
      ctx.error(`${member} is the last user with write access, refusing to remove`, 400);
      return;
    }
  }
  await dataset.setMemberAccess(ctx, mnemonic, member, permission);
  await dataset.dropKeys(ctx, mnemonic);
  ctx.body = 'ok';
};
export default route;
