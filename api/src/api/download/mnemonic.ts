import { User } from '../types';
import { readKey } from '#lib/keyv';
import db from '#lib/db';
import { RequestError } from '../errors';
import { get } from '#lib/fs';
import crypto from '#lib/crypto/index';
import { PassThrough } from 'stream';


export default async function mnemonic(user: User, mnemonic: string) {
  const { sub } = user;
  const key = await readKey(sub, mnemonic);
  if (!key) {
    throw new RequestError(`AES key not found, it needs to be stored by calling /download/${mnemonic}/decrypt first`);
  }

  const dataset = await db.dataset.findUnique({
    where: {
      mnemonic,
      deletedAt: null,
    },
    include: {
      chunks: true,
    },
  });
  if (!dataset) {
    throw new RequestError(`Dataset not found for mnemonic ${mnemonic}`);
  }
  const { chunks, fileName, size } = dataset;
  if (size === null) {
    throw new RequestError(`Dataset size is not set for ${mnemonic}, maybe it's not fully uploaded yet`);
  }



  const pStream = new PassThrough();
  for (const chunk of chunks) {
    const { hash, iv } = chunk;
    const stream = await get(mnemonic, hash);
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
