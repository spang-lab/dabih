import { User } from "../types";
import db from "#lib/db";
import { getMembers, Permission } from "#lib/database/member";

import { AuthorizationError } from "../errors";
import { getFile } from "#lib/database/inode";

export default async function file(user: User, mnemonic: string) {
  const { sub, isAdmin } = user;
  const file = await getFile(mnemonic);
  const members = await getMembers(mnemonic, Permission.READ);
  if (!isAdmin && !members.some(m => m.sub === sub)) {
    throw new AuthorizationError(`User ${sub} does not have permission to access file ${mnemonic}`);
  }
  const result = await db.user.findUnique({
    where: { sub },
    include: {
      keys: {
        where: {
          enabled: {
            not: null
          }
        }
      }
    }
  });
  const keys = result?.keys ?? [];
  const hashes = keys.map(k => k.hash);
  const { uid } = file.data;
  const data = await db.fileData.findUnique({
    where: {
      uid,
    },
    include: {
      chunks: true,
      keys: {
        where: {
          publicKeyHash: {
            in: hashes
          }
        }
      }
    }
  });
  if (!data) {
    throw new Error(`Data ${uid} not found`);
  }
  return {
    ...file,
    data,
    members,
  };
}
