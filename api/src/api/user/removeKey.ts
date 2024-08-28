import { KeyRemoveBody, User } from '../types';

import { AuthorizationError } from '../errors';
import db from '#lib/db';

export default async function removeKey(user: User, body: KeyRemoveBody) {
  if (!user.isAdmin && user.sub !== body.sub) {
    throw new AuthorizationError('Not authorized to remove key');
  }
  const result = await db.user.update({
    where: {
      sub: body.sub,
    },
    data: {
      keys: {
        // will only delete one but type system doesn't know that
        deleteMany: {
          hash: body.hash,
        },
      },
    },
    include: {
      keys: true,
    },
  });
  return result;
}
