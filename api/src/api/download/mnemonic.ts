import { User, InodeType } from '../types';
import { readKey } from '#lib/redis/aesKey';
import db from '#lib/db';
import { AuthorizationError, NotFoundError, RequestError } from '../errors';
import { get } from '#lib/fs';
import crypto from '#lib/crypto/index';
import { PassThrough } from 'stream';

const parseScope = (scopes: string[]) => {
  if (scopes.length !== 1) {
    throw new AuthorizationError(
      `Expected a token with a single download scope, got ${scopes.join(' ')}`,
    );
  }
  const [scope] = scopes;
  const regex = /^dabih:download:(\w+)$/;
  const match = regex.exec(scope);
  if (!match) {
    throw new AuthorizationError(
      `Invalid scope ${scope} expected dabih:download:<mnemonic>`,
    );
  }
  const [, mnemonic] = match;
  return mnemonic;
};

export default async function mnemonic(user: User) {
  const { sub, scopes } = user;
  const mnemonic = parseScope(scopes);
  const key = await readKey(sub, mnemonic);
  if (!key) {
    throw new RequestError(
      `AES key not found, it needs to be stored by calling /download/${mnemonic}/decrypt first`,
    );
  }
  const file = await db.inode.findUnique({
    where: {
      mnemonic,
      type: InodeType.FILE,
    },
    include: {
      data: {
        include: {
          chunks: true,
        },
      },
    },
  });
  if (!file) {
    throw new NotFoundError(`No file found for mnemonic ${mnemonic}`);
  }
  const { data } = file;
  if (!data) {
    throw new Error(`Inode ${mnemonic} has no data`);
  }
  const { chunks, fileName, size, uid } = data;
  if (size === null) {
    throw new RequestError(
      `Dataset size is not set for ${mnemonic}, maybe it's not fully uploaded yet`,
    );
  }
  const pStream = new PassThrough();
  for (const chunk of chunks) {
    const { hash, iv } = chunk;
    const stream = await get(uid, hash);
    const decrypt = crypto.aesKey.decrypt(key, iv);
    const isLast = chunk.end + BigInt(1) === size;
    stream.pipe(decrypt).pipe(pStream, { end: isLast });
  }
  return {
    stream: pStream,
    fileName,
    size,
  };
}
