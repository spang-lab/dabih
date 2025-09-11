import { Inode } from '@prisma/client';
import { User } from '../types';
import { getHome, getRoot } from '#lib/database/inodes';
import { isAbsolute, resolve as resolvePath } from 'path';
import db from '#lib/db';
import { NotFoundError } from '../errors';

export default async function resolve(
  user: User,
  path: string,
): Promise<Inode[]> {
  let nodes: Inode[] = [];
  if (isAbsolute(path)) {
    nodes.push(await getRoot());
  } else {
    nodes.push(await getHome(user.sub));
  }
  const parts = resolvePath('/', path)
    .split('/')
    .filter((p) => p && p !== '.');

  for (const part of parts) {
    const promises = nodes.map(async (node) => {
      return db.inode.findMany({
        where: {
          parentId: node.id,
          name: part,
        },
        include: {
          data: true,
        },
      });
    });
    const children = (await Promise.all(promises)).flat();
    if (children.length === 0) {
      throw new NotFoundError(`Path ${path} not found`);
    }
    nodes = children;
  }
  return nodes;
}
