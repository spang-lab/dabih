import db from "#lib/db";
import { AuthorizationError } from "../errors";

import { User } from "../types";

export default async function remove(user: User, sub: string) {
  const { isAdmin } = user;

  if (!isAdmin && sub !== user.sub) {
    throw new AuthorizationError('Not authorized to remove this user');
  }
  await db.user.update({
    where: {
      sub,
    },
    data: {
      keys: {
        deleteMany: {},
      },
    }
  });
  await db.user.delete({
    where: {
      sub,
    }
  });
}
