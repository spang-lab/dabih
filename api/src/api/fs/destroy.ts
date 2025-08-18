import { User, Permission } from '../types';
import { AuthorizationError, RequestError } from '../errors';
import { getPermission } from '#lib/database/member';
import { getTrash } from '#lib/database/inodes';
import { deleteInode, isChildOf } from '#lib/database/inode';

export default async function destroy(user: User, mnemonic: string) {
  const { sub } = user;
  const permission = await getPermission(mnemonic, sub);
  if (permission !== Permission.WRITE) {
    throw new AuthorizationError(
      `User ${sub} does not have permission to remove ${mnemonic}`,
    );
  }
  const trash = await getTrash(sub);
  if (trash.mnemonic === mnemonic) {
    throw new RequestError(`Cannot destroy trash itself`);
  }
  if (!(await isChildOf(mnemonic, trash.mnemonic))) {
    throw new Error(`${mnemonic} is not in trash`);
  }
  await deleteInode(mnemonic);
}
