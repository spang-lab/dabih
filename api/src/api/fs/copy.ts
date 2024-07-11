import { MoveInodeBody, User } from '../types';
import { AuthorizationError, RequestError } from '../errors';
import { getMembers, Permission } from '#lib/database/member';
import { InodeType } from '#lib/database/inode';
import { addKeys, removeKeys } from '#lib/database/keys';
import publicKey from '#lib/database/publicKey';
import db from '#lib/db';

export default async function move(user: User, body: MoveInodeBody) {
  const { sub, isAdmin } = user;
  const { mnemonic } = body;
  const inode = await getMembers(mnemonic, Permission.NONE);
  if (!isAdmin) {
    const permission =
      (inode.members.find((m) => m.sub === sub)?.permission as Permission) ??
      Permission.NONE;
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
  if (!body.parent) {
    return;
  }
  const keys = body.keys ?? [];
  const parentNode = await getMembers(body.parent, Permission.READ);
  const parentPermission =
    (parentNode.members.find((m) => m.sub === sub)?.permission as Permission) ??
    Permission.NONE;
  if (parentPermission !== Permission.WRITE) {
    throw new AuthorizationError(`Not authorized to move to ${body.parent}`);
  }
  if ((parentNode.type as InodeType) !== InodeType.DIRECTORY) {
    throw new RequestError(`Parent ${body.parent} is not a directory`);
  }
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
