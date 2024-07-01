
import { getPermission, Permission } from "#lib/database/member";

import { User } from "../types";
import { AuthorizationError } from "../errors";
import db from "#lib/db";
import { InodeType } from "#lib/database/inode";

export default async function remove(user: User, mnemonic: string) {
  const { sub, isAdmin } = user;
  if (!isAdmin) {
    const permission = await getPermission(mnemonic, sub);
    if (permission !== Permission.WRITE) {
      throw new AuthorizationError(`User ${sub} does not have permission to remove dataset ${mnemonic}`);
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
    }
  });
}
