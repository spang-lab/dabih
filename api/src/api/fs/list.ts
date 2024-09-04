import { AuthorizationError } from '../errors';
import { Permission, User, Mnemonic, InodeMembers } from '../types';
import db from '#lib/db';
import { getParents } from '#lib/database/inode';

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
  }
  const children = await db.inode.findMany({
    where: {
      parentId,
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
    parents,
    children,
  };
}
