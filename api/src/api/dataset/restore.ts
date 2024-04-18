import { getPermission } from "#lib/database/member";
import { User } from "../types";
import { Permission } from "#lib/database/member";
import { AuthorizationError } from "../errors";
import db from "#lib/db";

export default async function restore(user: User, mnemonic: string) {
  const { sub, isAdmin } = user;
  const permission = await getPermission(mnemonic, sub);

  if (permission !== Permission.WRITE && !isAdmin) {
    throw new AuthorizationError(`User ${sub} does not have permission to restore dataset ${mnemonic}`);
  }

  await db.dataset.update({
    where: {
      mnemonic,
      deletedAt: {
        not: null,
      }
    },
    data: {
      deletedAt: null,
    }
  });

}
