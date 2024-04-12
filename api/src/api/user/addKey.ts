
import db from "#lib/db";
import { AuthorizationError } from "../errors";
import { KeyAddBody, User } from "../types";
import { convertKey } from "./util";


export default async function addKey(user: User, body: KeyAddBody) {
  const { isAdmin } = user;
  if (!isAdmin && user.sub !== body.sub) {
    throw new AuthorizationError('Not authorized to this user');
  }
  const key = convertKey(user, body.data, body.isRootKey);

  const result = await db.user.update({
    where: {
      sub: body.sub,
    },
    data: {
      keys: {
        create: key,
      }
    },
    include: {
      keys: true,
    }
  });
  const keyData = result.keys.find(k => k.hash === key.hash);
  if (!keyData) {
    throw new Error('Should never happen, key not found after create');
  }
  return keyData;
}
