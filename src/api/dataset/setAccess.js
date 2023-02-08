import { dataset } from '../../database/index.js';
import { getSub, sendError } from '../../util/index.js';

const route = async (ctx) => {
  const sub = getSub(ctx);

  const { mnemonic } = ctx.params;
  if (!mnemonic) {
    sendError(ctx, 'No mnemonic', 400);
    return;
  }
  const access = await dataset.getMemberAccess(ctx, mnemonic, sub);
  if (access !== 'write') {
    sendError(ctx, 'You do not have permission add members', 400);
    return;
  }
  const { user, permission } = ctx.request.body;

  const currentPermission = await dataset.getMemberAccess(ctx, mnemonic, user);
  if (currentPermission === 'write') {
    const members = await dataset.listMembers(ctx, mnemonic);
    const writers = members.map((m) => m.permission === 'write');

    if (writers.length <= 1) {
      sendError(ctx, `${user} is the last user with write access, refusing to remove`, 400);
      return;
    }
  }
  await dataset.setMemberAccess(ctx, mnemonic, user, permission);
  await dataset.dropKeys(ctx, mnemonic);
  ctx.body = 'ok';
};
export default route;
