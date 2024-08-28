import { getPermission } from '#lib/database/member';
import { AuthorizationError } from '../errors';
import { Permission, User, Mnemonic, InodeType } from '../types';
import db from '#lib/db';

export default async function list(user: User, mnemonic?: Mnemonic) {
  const { sub, isAdmin } = user;
  let inode = null;
  if (mnemonic) {
    if (!isAdmin) {
      const permission = await getPermission(mnemonic, sub);
      if (permission === Permission.NONE) {
        throw new AuthorizationError(
          `Not authorized to list directory ${mnemonic}`,
        );
      }
    }
    inode = await db.inode.findUnique({
      where: {
        mnemonic,
      },
      include: {
        parent: true,
        members: true,
      },
    });
    if (!inode) {
      throw new AuthorizationError(`No such mnemonic ${mnemonic}`);
    }
    const type = inode.type as InodeType;
    if (type !== InodeType.DIRECTORY && type !== InodeType.TRASH) {
      throw new AuthorizationError(`Mnemonic ${mnemonic} is not a directory`);
    }
  }
  const inodes = await db.inode.findMany({
    where: {
      parentId: inode?.id ?? null,
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
  return {
    node: inode,
    inodes,
  };
}
