import db from '#lib/db';

import { convertToken } from '#lib/database/token';
import { User } from '../types';


export default async function list(user: User) {
  const { sub } = user;

  const results = await db.token.findMany({
    where: {
      sub,
    },
  });
  return results.map(token => convertToken(token, true));
}
