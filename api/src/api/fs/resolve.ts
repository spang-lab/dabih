import { Inode } from '@prisma/client';
import { User } from '../types';
import { getHome, getRoot } from '#lib/database/inodes';
import { isAbsolute, resolve as resolvePath } from 'path';
import db from '#lib/db';
import { RequestError } from '../errors';

async function resolveMnemonic(mnemonic: string): Promise<Inode | null> {
  if (!/^[a-z_]+$/.exec(mnemonic)) {
    return null;
  }
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
    },
    include: {
      data: true,
    },
  });
  return inode;
}

export default async function resolve(
  user: User,
  path: string,
): Promise<Inode | null> {
  let nodes: Inode[] = [];

  const match = await resolveMnemonic(path);
  if (match) {
    return match;
  }

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
      return null;
    }
    nodes = children;
  }
  if (nodes.length > 1) {
    const mnemonics = nodes.map((n) => n.mnemonic).join(', ');
    throw new RequestError(`Path "${path}" is ambiguous, matched mnemonics: ${mnemonics}
                           use a mnemonic to disambiguate.`);
  }
  return nodes[0] || null;
}
