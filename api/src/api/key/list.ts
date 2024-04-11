import { User } from "../types";
import db from "#lib/db";


export default async function list(user: User) {
  const { sub } = user;
  const result = await db.user.findUnique({
    where: {
      sub,
    },
    include: {
      "keys": true,
    },
  });
  if (!result) {
    return [];
  }
  return result.keys;
}
