import { AuthorizationError } from '../errors';
import { User } from '../types';
import db from '#lib/db';

export default async function orphaned(user: User) {
  const { sub, isAdmin } = user;
  if (!isAdmin) {
    throw new AuthorizationError(
      `User ${sub} is not authorized to list orphaned file data`,
    );
  }

  const entries = await db.fileData.findMany({
    where: {
      inodes: {
        none: {},
      },
    },
  });

  return entries;
}
