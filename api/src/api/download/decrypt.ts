import { AESKey, User } from "../types";

import { RequestError, AuthorizationError } from "../errors";
import { Permission } from "#lib/database/member";
import db from "#lib/db";
import crypto from "#lib/crypto/index";
import { convertToken, generateValue } from "#lib/database/token";
import { storeKey } from "#lib/keyv";

export default async function decrypt(user: User, mnemonic: string, key: AESKey) {
  const { sub, isAdmin } = user;
  const dataset = await db.dataset.findUnique({
    where: {
      mnemonic,
      deletedAt: null,
    },
    include: {
      members: true,
    },
  });
  if (!dataset) {
    throw new RequestError(`Dataset ${mnemonic} not found`);
  }
  const { members } = dataset;
  const permission = members.find((m) => m.sub === sub)?.permission;
  if (permission !== Permission.READ && !isAdmin) {
    throw new AuthorizationError(`User ${user.sub} does not have permission to decrypt dataset ${mnemonic}`);
  }
  const keyHash = crypto.aesKey.toHash(key);
  if (dataset.keyHash !== keyHash) {
    throw new RequestError(`Invalid key for dataset ${mnemonic}, hash mismatch ${dataset.keyHash} !== ${keyHash}`);
  }
  await storeKey(sub, mnemonic, key);
  const scope = `dabih:download:${mnemonic}`;
  const value = await generateValue();
  const lifetimeMs = 30 * 1000;
  const exp = new Date(new Date().getTime() + lifetimeMs);
  const result = await db.token.create({
    data: {
      value,
      sub,
      scope,
      exp,
    },
  });
  const token = convertToken(result, false);
  return token;
}
