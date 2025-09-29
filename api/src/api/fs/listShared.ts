import { Permission, User } from '../types';
import db from '#lib/db';
import { getParents } from '#lib/database/inode';
import { getHome } from '#lib/database/inodes';

export default async function listShared(user: User) {
  const { sub } = user;
  const home = await getHome(sub);
  const parents = await getParents(home.mnemonic);

  const shared = await db.inode.findMany({
    where: {
      members: {
        some: {
          sub,
          permission: {
            not: Permission.NONE,
          },
        },
      },
      id: {
        not: home.id,
      },
    },
    include: {
      members: true,
      data: true,
    },
  });
  return {
    parents,
    children: shared,
  };
}
