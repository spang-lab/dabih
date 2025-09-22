import { User } from '../types';
import { listBuckets } from '#lib/fs/index';
import db from '#lib/db';

export default async function checkIntegrity(user: User) {
  const { sub, isAdmin } = user;
  if (!isAdmin) {
    throw new Error(`User ${sub} is not authorized to list unknown buckets`);
  }

  const validUids = await db.fileData
    .findMany({
      select: {
        uid: true,
      },
    })
    .then((entries) => entries.map((entry) => entry.uid));
  const validUidSet = new Set(validUids);

  const folders = await listBuckets();
  const regex = /^[A-Za-z0-9_-]{12}$/;
  const uids = new Set(folders.filter((folder) => regex.test(folder)));

  return {
    missing: [...validUidSet.difference(uids)],
    unknown: [...uids.difference(validUidSet)],
  };
}
