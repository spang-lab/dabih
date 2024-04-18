import { getPermission } from "#lib/database/member";
import { User } from "../types";
import { Permission } from "#lib/database/member";
import { AuthorizationError } from "../errors";
import db from "#lib/db";

export default async function rename(user: User, mnemonic: string, name: string) {
  const { sub, isAdmin } = user;
  const permission = await getPermission(mnemonic, sub);

  if (permission !== Permission.WRITE && !isAdmin) {
    throw new AuthorizationError(`User ${sub} does not have permission to rename dataset ${mnemonic}`);
  }

  await db.dataset.update({
    where: { mnemonic },
    data: {
      name,
    }
  });

}
