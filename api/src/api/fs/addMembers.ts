import { getMembers } from '#lib/database/member';

import { MemberAddBody, User, Permission } from '../types';
import { AuthorizationError } from '../errors';
import { addKeys } from '#lib/database/keys';
import publicKey from '#lib/database/publicKey';
import db from '#lib/db';

export default async function addMembers(
  user: User,
  mnemonic: string,
  body: MemberAddBody,
) {
  const inode = await getMembers(mnemonic, Permission.NONE);
  const { members } = inode;
  const permission = members.find((m) => m.sub === user.sub)?.permission;
  if (permission !== Permission.WRITE) {
    throw new AuthorizationError(
      `User ${user.sub} does not have permission to add members to dataset ${mnemonic}`,
    );
  }
  const { subs, keys } = body;
  const publicKeys = await publicKey.listUsers(subs);
  await addKeys(mnemonic, keys, publicKeys);

  const newUsers = subs
    .filter((sub) => !members.find((m) => m.sub === sub))
    .map((sub) => ({
      sub,
      permission: Permission.READ,
    }));
  await db.inode.update({
    where: {
      id: inode.id,
    },
    data: {
      members: {
        createMany: {
          data: newUsers,
        },
      },
    },
  });
}
