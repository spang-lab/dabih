import {
  MoveInodeBody,
  User,
  InodeType,
  Permission,
  InodeMembers,
} from '../types';
import { AuthorizationError, RequestError } from '../errors';
import { getMembers, getPermission } from '#lib/database/member';
import { addKeys, removeKeys } from '#lib/database/keys';
import publicKey from '#lib/database/publicKey';
import db from '#lib/db';

const checkAuthorized = (parentNode: InodeMembers, sub: string) => {
  const parentPermission =
    (parentNode.members.find((m) => m.sub === sub)?.permission as Permission) ??
    Permission.NONE;

  if (
    parentPermission === Permission.READ &&
    parentNode.type === InodeType.TRASH
  ) {
    return;
  }

  if (parentPermission !== Permission.WRITE) {
    throw new AuthorizationError(
      `Not authorized to move to ${parentNode.mnemonic}`,
    );
  }
  if (parentNode.type !== InodeType.DIRECTORY) {
    throw new RequestError(`Parent ${parentNode.mnemonic} is not a directory`);
  }
};

export default async function move(user: User, body: MoveInodeBody) {
  const { sub, isAdmin } = user;
  const { mnemonic } = body;
  if (!isAdmin) {
    const permission = await getPermission(mnemonic, sub);
    if (permission !== Permission.WRITE) {
      throw new AuthorizationError(`Not authorized to move ${mnemonic}`);
    }
  }
  const { name, tag } = body;
  if (name !== undefined || tag !== undefined) {
    await db.inode.update({
      where: { mnemonic },
      data: {
        name,
        tag,
      },
    });
  }
  if (body.parent === undefined) {
    return;
  }
  if (body.parent === null) {
    await db.inode.update({
      where: { mnemonic },
      data: {
        parent: {
          disconnect: true,
        },
      },
    });
    await removeKeys(mnemonic);
    return;
  }

  const keys = body.keys ?? [];
  const parentNode = await getMembers(body.parent, Permission.READ);
  if (parentNode.mnemonic === mnemonic) {
    throw new RequestError(`Cannot move ${mnemonic} into itself`);
  }
  checkAuthorized(parentNode, sub);
  const { members } = parentNode;
  const subs = members.map((member) => member.sub);
  const publicKeys = await publicKey.listUsers(subs);
  await addKeys(mnemonic, keys, publicKeys);
  await db.inode.update({
    where: { mnemonic },
    data: {
      parent: {
        connect: {
          id: parentNode.id,
        },
      },
    },
  });
  await removeKeys(mnemonic);
}
