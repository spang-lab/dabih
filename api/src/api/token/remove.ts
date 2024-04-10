import db from '#lib/db';
import { User } from '../types';

export default async function remove(user: User, tokenId: number) {
  const { sub } = user;
  await db.token.delete({
    where: {
      id: tokenId,
      sub,
    },
  });

}
