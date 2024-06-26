
import { getFile } from '#lib/database/inode';
import { Permission, getPermission } from '#lib/database/member';
import db from '#lib/db';
import { removeBucket } from '#lib/fs';
import { AuthorizationError } from '../errors';
import { User } from '../types';

export default async function cancel(user: User, mnemonic: string) {
  if (!user.isAdmin) {
    const permission = await getPermission(mnemonic, user.sub);
    if (permission !== Permission.WRITE) {
      throw new AuthorizationError('Not authorized to cancel this dataset');
    }
  }
  const file = await getFile(mnemonic);
  const { uid } = file.data;

  await db.fileData.update({
    where: {
      uid,
    },
    data: {
      keys: {
        deleteMany: {}
      },
      chunks: {
        deleteMany: {}
      },
    },
    include: {
      keys: true,
      chunks: true,
    }
  });
  await db.inode.update({
    where: {
      mnemonic,
    },
    data: {
      members: {
        deleteMany: {}
      },
      data: {
        delete: true,
      }
    }
  });
  await db.inode.delete({
    where: {
      mnemonic,
    }
  });
  await removeBucket(uid);
}
