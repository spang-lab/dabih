import { KeyAddBody, User } from "../types";

import dbg from "#lib/util/dbg";
import db from "#lib/db";
import crypto from "#crypto";


export default async function add(user: User, body: KeyAddBody) {
  const { sub, isAdmin } = user;

  const publicKey = crypto.publicKey.fromJwk(
    body.data,
  );
  const hash = crypto.publicKey.toHash(publicKey);
  const jwk = crypto.publicKey.toJwk(publicKey);
  const key = {
    hash,
    data: JSON.stringify(jwk),
    isRootKey: body.isRootKey,
    enabled: (isAdmin ? new Date() : null),
    enabledBy: (isAdmin ? sub : null),
  };

  const result = await db.user.upsert({
    where: {
      sub,
    },
    create: {
      sub,
      name: body.user.name,
      email: body.user.email,
      keys: {
        create: key,
      }
    },
    update: {
      keys: {
        create: key,
      }
    },
    include: {
      "keys": true,
    }
  });
  const keyData = result.keys.find(k => k.hash === hash);
  if (!keyData) {
    throw new Error('Should never happen, key not found after upsert');
  }
  return keyData;
}
