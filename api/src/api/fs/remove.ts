import { getPermission } from '#lib/database/member';

import { User, Permission, InodeType } from '#types';
import { AuthorizationError } from '../errors';
import db from '#lib/db';

export default async function remove(user: User, mnemonic: string) {
  const { sub, isAdmin } = user;
  if (!isAdmin) {
    const permission = await getPermission(mnemonic, sub);
    if (permission !== Permission.WRITE) {
      throw new AuthorizationError(
        `User ${sub} does not have permission to remove ${mnemonic}`,
      );
    }
  }
  await db.inode.update({
    where: {
      mnemonic,
      type: InodeType.FILE,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}
