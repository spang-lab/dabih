import { User } from '../types';
import { readKey } from '#lib/keyv';
import db from '#lib/db';
import { AuthorizationError, RequestError } from '../errors';
import { get } from '#lib/fs';
import crypto from '#lib/crypto/index';
import { PassThrough } from 'stream';
import { getFile } from '#lib/database/inode';

const parseScope = (scopes: string[]) => {
  if (scopes.length !== 1) {
    throw new AuthorizationError(`Expected a token with a single download scope, got ${scopes.join(' ')}`);
  }
  const [scope] = scopes;
  const regex = /^dabih:download:(\w+)$/;
  const match = scope.match(regex);
  if (!match) {
    throw new AuthorizationError(`Invalid scope ${scope} expected dabih:download:<mnemonic>`);
  }
  const [, mnemonic] = match;
  return mnemonic;
};

export default async function mnemonic(user: User) {
  const { sub, scopes } = user;
  const mnemonic = parseScope(scopes);
  const key = await readKey(sub, mnemonic);
  if (!key) {
    throw new RequestError(`AES key not found, it needs to be stored by calling /download/${mnemonic}/decrypt first`);
  }
  const file = await getFile(mnemonic);
  const uid = file.data.uid;
  const fileData = await db.fileData.findUnique({
    where: {
      uid,
    },
    include: {
      chunks: true,
    },
  });
  if (!fileData) {
    throw new RequestError(`Dataset not found for mnemonic ${mnemonic}`);
  }
  const { chunks, fileName, size } = fileData;
  if (size === null) {
    throw new RequestError(`Dataset size is not set for ${mnemonic}, maybe it's not fully uploaded yet`);
  }
  const pStream = new PassThrough();
  for (const chunk of chunks) {
    const { hash, iv } = chunk;
    const stream = await get(uid, hash);
    const decrypt = crypto.aesKey.decrypt(key, iv);
    const isLast = chunk.end + 1 === size;
    stream.pipe(decrypt).pipe(pStream, { end: isLast });
  }
  return {
    stream: pStream,
    fileName,
    size,
  };
}
