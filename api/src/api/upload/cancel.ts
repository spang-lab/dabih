
import { Permission, getPermission } from '#lib/database/member';
import db from '#lib/db';
import { removeBucket } from '#lib/fs';
import { AuthorizationError } from '../errors';
import { User } from '../types';

export default async function cancel(user: User, mnemonic: string) {
  const permission = await getPermission(mnemonic, user.sub);
  if (!user.isAdmin && permission !== Permission.WRITE) {
    throw new AuthorizationError('Not authorized to cancel this dataset');
  }

  await db.dataset.update({
    where: {
      mnemonic,
    },
    data: {
      keys: {
        deleteMany: {}
      },
      chunks: {
        deleteMany: {}
      },
      members: {
        deleteMany: {}
      }
    },
    include: {
      keys: true,
      chunks: true,
      members: true,
    }
  });
  await db.dataset.delete({
    where: {
      mnemonic,
    }
  });
  await removeBucket(mnemonic);
}
