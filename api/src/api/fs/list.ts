import { AuthorizationError } from '../errors';
import { Permission, User, InodeMembers, InodeType } from '../types';
import db from '#lib/db';
import { getParents } from '#lib/database/inode';
import { getHome } from '#lib/database/inodes';

function isListable(inode: InodeMembers) {
  if (inode.type === InodeType.FILE || inode.type === InodeType.UPLOAD) {
    return false;
  }
  return true;
}

export default async function list(user: User, mnemonic?: string) {
  const { sub, isAdmin } = user;
  let parents: InodeMembers[] = [];
  let parentId = null;
  if (mnemonic) {
    parents = await getParents(mnemonic);
    const isRoot = parents.length === 1;
    if (!isAdmin && !isRoot) {
      const members = parents.flatMap((parent) =>
        parent.members
          .filter((m) => m.permission !== Permission.NONE)
          .map((m) => m.sub),
      );
      if (!members.includes(sub)) {
        throw new AuthorizationError(
          `Not authorized to list directory ${mnemonic}`,
        );
      }
    }
    if (!isListable(parents[0])) {
      parents = parents.slice(1);
    }
    parentId = parents[0].id as bigint;
  } else {
    const home = await getHome(sub);
    parents = await getParents(home.mnemonic);
    parentId = home.id;
  }
  const children = await db.inode.findMany({
    where: {
      parentId,
    },
    include: {
      members: true,
      data: true,
    },
  });
  return {
    parents,
    children,
  };
}
