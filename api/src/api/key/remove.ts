import { User } from "../types";
import db from "#lib/db";

export default async function remove(user: User, keyId: number) {
  const { sub } = user;

  const result = await db.user.update({
    where: {
      sub,
    },
    data: {
      keys: {
        delete: {
          id: keyId,
        },
      },
    },
    include: {
      "keys": true,
    },
  });
  if (result.keys.length === 0) {
    await db.user.delete({
      where: {
        sub,
      },
    });
  }
}
