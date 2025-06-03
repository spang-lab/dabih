import { User } from '../types';
import { UserAddBody } from '../types';
import { AuthorizationError } from '../errors';
import db from '#lib/db';

import { convertKey } from './util';
import { getHome } from '#lib/database/inodes';

export default async function add(user: User, body: UserAddBody) {
  const { isAdmin } = user;

  if (!isAdmin && body.sub && user.sub !== body.sub) {
    throw new AuthorizationError('Not authorized to add a user');
  }
  const sub = body.sub ?? user.sub;

  const key = convertKey(user, body.key, body.isRootKey);
  await getHome(sub);
  const defaultScope = ['dabih:upload', 'dabih:api'].join(' ');
  const result = await db.user.create({
    data: {
      sub,
      email: body.email,
      scope: defaultScope,
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
