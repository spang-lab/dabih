import { getMembers, toPermissionString } from '#lib/database/member';
import { AuthorizationError } from '../errors';
import { User, Permission } from '../types';

export default async function listMembers(user: User, mnemonic: string) {
  const { sub, isAdmin } = user;
  const inode = await getMembers(mnemonic, Permission.NONE);

  const { members } = inode;
  if (!members.find((m) => m.sub === sub) && !isAdmin) {
    throw new AuthorizationError(
      `Not authorized to view members for ${mnemonic}`,
    );
  }
  return members.map((m) => ({
    ...m,
    permissionString: toPermissionString(m.permission),
    mnemonic,
  }));
}
