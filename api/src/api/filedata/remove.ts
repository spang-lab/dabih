import { User } from '../types';
import db from '#lib/db';
import { NotFoundError } from '../errors';
import { removeBucket } from '#lib/fs/index';

export default async function remove(user: User, uid: string) {
  const { sub, isAdmin } = user;
  if (!isAdmin && sub !== uid) {
    throw new Error('Not authorized to remove file data');
  }

  const fileData = await db.fileData.findUnique({
    where: {
      uid,
    },
    include: {
      chunks: true,
    },
  });
  if (!fileData) {
    throw new NotFoundError(`File data with uid ${uid} not found`);
  }

  const chunkIds = fileData.chunks.map((chunk) => chunk.id);

  await db.$transaction([
    db.chunk.deleteMany({
      where: {
        id: {
          in: chunkIds,
        },
      },
    }),
    db.fileData.delete({
      where: {
        uid,
      },
    }),
  ]);

  await removeBucket(uid);
}
