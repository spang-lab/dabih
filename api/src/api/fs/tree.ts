import { User, Permission } from '#types';
import { AuthorizationError } from '../errors';
import { getPermission } from '#lib/database/member';
import { listTree } from '#lib/database/inode';

export default async function tree(user: User, mnemonic: string) {
  const { sub, isAdmin } = user;
  if (!isAdmin) {
    const permission = await getPermission(mnemonic, sub);
    if (permission === Permission.NONE) {
      throw new AuthorizationError(
        `Not authorized to view directory ${mnemonic}`,
      );
    }
  }
  const inodes = await listTree(mnemonic);
  return inodes;
}
