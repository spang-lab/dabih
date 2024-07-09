import { Permission, getMembers } from "#lib/database/member";

import { MemberAddBody, User } from "../types";
import { AuthorizationError, RequestError } from "../errors";
import { addKeys } from "#lib/database/keys";
import db from "#lib/db";


export default async function addMembers(user: User, mnemonic: string, body: MemberAddBody) {
  const inode = await getMembers(mnemonic, Permission.NONE);
  const { members } = inode;
  const permission = members.find((m) => m.sub === user.sub)?.permission;
  if (permission !== Permission.WRITE) {
    throw new AuthorizationError(`User ${user.sub} does not have permission to add members to dataset ${mnemonic}`);
  }
  const { subs, keys } = body;
  const users = await db.user.findMany({
    where: {
      sub: {
        in: subs,
      },
    },
    include: {
      keys: {
        where: {
          enabled: {
            not: null,
          }
        }
      },
    },
  });
  if (users.length !== subs.length) {
    const missing = subs.filter((sub) => !users.find((u) => u.sub === sub));
    throw new RequestError(`Some users were not found, missing: ${missing.join(", ")}`);
  }

  const publicKeys = users.map((u) => {
    const { keys } = u;
    if (keys.length === 0) {
      throw new RequestError(`No valid public keys found for user ${u.sub}`);
    }
    return keys;
  }).flat();

  await addKeys(mnemonic, keys, publicKeys);

  const newUsers = subs.filter((sub) => !members.find((m) => m.sub === sub)).map((sub) => ({
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
