import { AESKey, User } from "../types";

import { RequestError, AuthorizationError } from "../errors";
import { Permission, getPermission } from "#lib/database/member";
import db from "#lib/db";
import crypto from "#lib/crypto/index";
import { convertToken, generateValue } from "#lib/database/token";
import { storeKey } from "#lib/keyv";
import { getFile } from "#lib/database/inode";

export default async function decrypt(user: User, mnemonic: string, key: AESKey) {
  const { sub, isAdmin } = user;
  const file = await getFile(mnemonic);
  const permission = await getPermission(mnemonic, sub);

  if (permission !== Permission.READ && !isAdmin) {
    throw new AuthorizationError(`User ${user.sub} does not have permission to decrypt file ${mnemonic}`);
  }
  const keyHash = crypto.aesKey.toHash(key);
  if (file.data.keyHash !== keyHash) {
    throw new RequestError(`Invalid key for dataset ${mnemonic}, hash mismatch ${file.data.keyHash} !== ${keyHash}`);
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
