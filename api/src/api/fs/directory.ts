import { User } from "../types";
import db from "#lib/db";
import { getPermission, Permission } from "#lib/database/member";
import { AuthorizationError } from "../errors";
import { InodeType } from "#lib/database/inode";

export default async function directory(user: User, mnemonic: string) {
  const { sub, isAdmin } = user;

  if (!isAdmin) {
    const permission = await getPermission(mnemonic, sub);
    if (permission === Permission.NONE) {
      throw new AuthorizationError(`Not authorized to view directory ${mnemonic}`);
    }
  }
  const folder = await db.inode.findUnique({
    where: {
      mnemonic,
      type: InodeType.DIRECTORY,
    },
    include: {
      children: true,
    },
  });
  return folder;
}