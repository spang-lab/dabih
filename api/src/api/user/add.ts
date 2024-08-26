import { User } from '../types';
import { UserAddBody } from '../types';
import { AuthorizationError } from '../errors';
import db from '#lib/db';

import { convertKey } from './util';

export default async function add(user: User, body: UserAddBody) {
  const { isAdmin } = user;

  if (!isAdmin && body.sub && user.sub !== body.sub) {
    throw new AuthorizationError('Not authorized to this user');
  }
  const sub = body.sub ?? user.sub;

  const key = convertKey(user, body.key, body.isRootKey);
  const result = await db.user.create({
    data: {
      sub,
      name: body.name,
      email: body.email,
      keys: {
        create: key,
      },
    },
    include: {
      keys: true,
    },
  });
  return result;
}
