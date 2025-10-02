import { User, InodeType } from '../types';

import { NotFoundError, RequestError } from '../errors';
import db from '#lib/db';
import crypto from '#lib/crypto/index';
import { convertToken, generateValue } from '#lib/database/token';
import { storeKey } from '#lib/redis/aesKey';

export default async function decrypt(
  user: User,
  mnemonic: string,
  key: string,
) {
  const { sub } = user;
  const file = await db.inode.findUnique({
    where: {
      mnemonic,
      type: InodeType.FILE,
    },
    include: {
      data: true,
    },
  });
  if (!file) {
    throw new NotFoundError(`No file found for mnemonic ${mnemonic}`);
  }
  const { data } = file;
  if (!data) {
    throw new Error(`Inode ${mnemonic} has type FILE but no data`);
  }

  const keyHash = crypto.aesKey.toHash(key);
  if (data.keyHash !== keyHash) {
    throw new RequestError(
      `Invalid key for dataset ${mnemonic}, hash mismatch ${data.keyHash} !== ${keyHash}`,
    );
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
