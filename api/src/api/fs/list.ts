import { AuthorizationError } from '../errors';
import { Permission, User, Mnemonic, InodeMembers } from '../types';
import db from '#lib/db';
import { getParents } from '#lib/database/inode';
import { getHome } from '#lib/database/inodes';

export default async function list(user: User, mnemonic?: Mnemonic) {
  const { sub, isAdmin } = user;
  let parents: InodeMembers[] = [];
  let parentId = null;
  if (mnemonic) {
    parents = await getParents(mnemonic);
    if (!isAdmin) {
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
