import db from '#lib/db';
import { Chunk } from '@prisma/client';
import { RequestError } from '../errors';
import { User } from '../types';
import { createHash } from 'crypto';
import { deleteKey } from '#lib/keyv';
import { getFile } from '#lib/database/inode';

type ChunkRange = Pick<Chunk, 'start' | 'end'>;

export const validChunkEnd = (chunks: ChunkRange[]) => {
  return chunks.reduce((end, chunk) => {
    if (chunk.start === end + 1) {
      return chunk.end;
    }
    return -1;
  }, -1);
};

const hashChunks = (chunks: { hash: string }[]) => {
  const hash = createHash('sha256');
  for (const chunk of chunks) {
    hash.update(chunk.hash, 'base64url');
  }
  return hash.digest('base64url');
};

export default async function finish(user: User, mnemonic: string) {
  const { sub } = user;
  const file = await getFile(mnemonic);
  const { uid } = file.data;
  const fileData = await db.fileData.findUnique({
    where: {
      uid,
      createdBy: sub,
    },
    include: {
      chunks: {
        orderBy: {
          start: 'asc',
        }
      },
    }
  });
  if (!fileData) {
    throw new RequestError(`No fileData found for mnemonic ${mnemonic} and user ${sub}`);
  }
  const { chunks } = fileData;
  const end = validChunkEnd(chunks);
  if (end === -1) {
    throw new RequestError(`Chunks are not complete for dataset ${mnemonic}`);
  }
  if (fileData.size && fileData.size !== end + 1) {
    throw new RequestError(`Dataset size: ${fileData.size} does not match chunks end: ${end + 1} for dataset ${mnemonic}`);
  }
  const hash = hashChunks(chunks);

  const result = await db.fileData.update({
    where: {
      uid,
      createdBy: sub,
    },
    data: {
      hash,
      size: end + 1,
    }
  });
  await deleteKey(sub, mnemonic);
  return {
    ...file,
    data: result,
  };
}
