import db from '#lib/db';
import { Chunk } from '@prisma/client';
import { RequestError } from '../errors';
import { User } from '../types';
import { createHash } from 'crypto';
import { deleteKey } from '#lib/keyv';

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
  const dataset = await db.dataset.findUnique({
    where: {
      mnemonic,
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
  if (!dataset) {
    throw new RequestError(`No dataset found with mnemonic ${mnemonic} for user ${sub}`);
  }

  const { chunks } = dataset;
  const end = validChunkEnd(chunks);
  if (end === -1) {
    throw new RequestError(`Chunks are not complete for dataset ${mnemonic}`);
  }
  if (dataset.size && dataset.size !== end + 1) {
    throw new RequestError(`Dataset size: ${dataset.size} does not match chunks end: ${end + 1} for dataset ${mnemonic}`);
  }

  const hash = hashChunks(chunks);

  const result = await db.dataset.update({
    where: {
      mnemonic,
      createdBy: sub,
    },
    data: {
      hash,
      size: end + 1,
    }
  });
  await deleteKey(sub, mnemonic);
  return result;
}
