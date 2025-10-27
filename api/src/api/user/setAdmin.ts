import { RequestError } from '../errors';
import db from '#lib/db';
import { Scope } from '../types';

export default async function setAdmin(sub: string, admin: boolean) {
  const existing = await db.user.findUnique({
    where: {
      sub,
    },
  });
  if (!existing) {
    throw new RequestError(`User ${sub} not found`);
  }
  const scopes = new Set(existing.scope.split(' '));
  if (admin) {
    scopes.add(Scope.ADMIN);
  } else {
    scopes.delete(Scope.ADMIN);
  }
  const scope = Array.from(scopes).join(' ');
  const result = await db.user.update({
    where: {
      sub,
    },
    data: {
      scope,
    },
    include: {
      keys: true,
    },
  });
  return result;
}
