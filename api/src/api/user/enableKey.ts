import { KeyEnableBody, User } from '../types';

import { AuthorizationError } from '../errors';
import db from '#lib/db';

export default async function enableKey(user: User, body: KeyEnableBody) {
  if (!user.isAdmin) {
    throw new AuthorizationError('Not authorized to enable key');
  }

  const data = {
    enabled: body.enabled ? new Date() : null,
    enabledBy: body.enabled ? user.sub : null,
  };

  const result = await db.user.update({
    where: {
      sub: body.sub,
    },
    data: {
      keys: {
        // will only update one but type system doesn't know that
        updateMany: {
          where: {
            hash: body.hash,
          },
          data,
        },
      },
    },
    include: {
      keys: true,
    },
  });

  const scopes = result.scope.split(' ');
  if (!scopes.includes('dabih:api') && body.enabled) {
    scopes.push('dabih:api');
    await db.user.update({
      where: {
        sub: body.sub,
      },
      data: {
        scope: scopes.join(' '),
      },
    });
  }

  const keyData = result.keys.find((k) => k.hash === body.hash);
  if (!keyData) {
    throw new Error('Should never happen, key not found after enable');
  }
  return keyData;
}
