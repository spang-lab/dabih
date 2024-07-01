
import { Permission, getPermission } from '#lib/database/member';
import db from '#lib/db';
import { removeBucket } from '#lib/fs';
import { AuthorizationError } from '../errors';
import { User } from '../types';

export default async function cancel(user: User, mnemonic: string) {
  if (!user.isAdmin) {
    const permission = await getPermission(mnemonic, user.sub);
    if (permission !== Permission.WRITE) {
      throw new AuthorizationError('Not authorized to cancel this upload');
    }
  }
  const file = await db.inode.update({
    where: {
      mnemonic,
    },
    data: {
      data: {
        update: {
          keys: {
            deleteMany: {}
          },
          chunks: {
            deleteMany: {}
          }
        }
      }
    },
    include: {
      data: {
        include: {
          keys: true,
          chunks: true,
        },
      }
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

  const { data } = file;
  if (!data) {
    throw new Error(`Inode ${mnemonic} has type UPLOAD but no data`);
  }
  await removeBucket(data.uid);
}
