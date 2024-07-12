import { getPermission } from '#lib/database/member';
import { AuthorizationError } from '../errors';
import { Permission, User, Mnemonic } from '../types';
import db from '#lib/db';

export default async function list(user: User, mnemonic?: Mnemonic) {
  const { sub, isAdmin } = user;
  let parentId = null;
  if (mnemonic) {
    if (!isAdmin) {
      const permission = await getPermission(mnemonic, sub);
      if (permission === Permission.NONE) {
        throw new AuthorizationError(
          `Not authorized to list directory ${mnemonic}`,
        );
      }
    }
    const inode = await db.inode.findUnique({
      where: {
        mnemonic,
      },
    });
    if (!inode) {
      throw new AuthorizationError(`No such mnemonic ${mnemonic}`);
    }
    parentId = inode.id;
  }
  const inodes = await db.inode.findMany({
    where: {
      parentId: parentId,
      members: {
        some: {
          sub,
        },
      },
    },
    include: {
      members: true,
      data: true,
    },
  });
  return inodes;
}
