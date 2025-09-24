import { User, InodeType } from '../types';

import db from '#lib/db';
import logger from '#lib/logger';
import { readKey } from '#lib/redis/aesKey';
import { deleteInode } from '#lib/database/inode';

export default async function cleanup(user: User) {
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
    const { mnemonic } = file;
    const key = await readKey(sub, mnemonic);
    if (key) {
      // Do not cleanup if we have the key, they might resume the upload
      return null;
    }
    return file;
  });
  const results = (await Promise.all(promises)).filter((f) => f !== null);

  for (const file of results) {
    const { mnemonic } = file;
    logger.info(`Cleaning up unfinished upload ${mnemonic} for user ${sub}`);
    await deleteInode(mnemonic);
  }
}
