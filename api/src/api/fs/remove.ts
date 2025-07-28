import { getPermission } from '#lib/database/member';

import { User, Permission } from '../types';
import { AuthorizationError, RequestError } from '../errors';
import db from '#lib/db';
import { isChildOf } from '#lib/database/inode';
import { removeKeys } from '#lib/database/keys';
import { getTrash } from '#lib/database/inodes';

export default async function remove(user: User, mnemonic: string) {
  const { sub } = user;
  const permission = await getPermission(mnemonic, sub);
  if (permission !== Permission.WRITE) {
    throw new AuthorizationError(
      `User ${sub} does not have permission to remove ${mnemonic}`,
    );
  }
  const trash = await getTrash(sub);
  if (trash.mnemonic === mnemonic) {
    throw new RequestError(`Cannot move ${mnemonic} into itself`);
  }
  if (await isChildOf(mnemonic, trash.mnemonic)) {
    throw new RequestError(`${mnemonic} already is in trash`);
  }
  await db.inode.update({
    where: { mnemonic },
    data: {
      parent: {
        connect: {
          id: trash.id,
        },
      },
    },
  });
  await removeKeys(mnemonic);
}
