import { User, InodeType } from '../types';

import db from '#lib/db';
import { readKey } from '#lib/redis/aesKey';

export default async function unfinished(user: User) {
  const { sub } = user;

  const unfinished = await db.inode.findMany({
    where: {
      type: InodeType.UPLOAD,
    },
    include: {
      data: {
        where: {
          createdBy: sub,
          hash: null,
        },
        include: {
          chunks: {
            orderBy: {
              start: 'asc',
            },
          },
        },
      },
    },
  });

  const promises = unfinished.map(async (file) => {
    const { data, mnemonic } = file;
    const key = await readKey(sub, mnemonic);
    if (!data || !key) {
      return null;
    }
    return {
      ...file,
      data,
    };
  });
  const results = (await Promise.all(promises)).filter((f) => f !== null);
  return results;
}
