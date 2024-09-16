import { ChunkAddBody, RequestWithUser, InodeType } from '../types';
import { readKey } from '#lib/redis/aesKey';
import { NotFoundError, RequestError } from '../errors';
import crypto from '#crypto';
import db from '#lib/db';
import { head, store } from '#lib/fs';
import Busboy, { BusboyHeaders } from '@fastify/busboy';

import { Request } from 'koa';
export type RequestWithHeaders = Request & RequestWithUser;

export default async function chunk(
  body: ChunkAddBody,
  request: RequestWithHeaders,
) {
  const { mnemonic, start, end } = body;
  const { user } = request;
  const { sub } = user;

  const file = await db.inode.findUnique({
    where: {
      mnemonic,
      type: InodeType.UPLOAD,
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
    throw new NotFoundError(`No upload found for mnemonic ${mnemonic}`);
  }
  const { data } = file;
  if (!data) {
    throw new Error(`Inode ${mnemonic} has type UPLOAD but no data`);
  }
  const { uid, chunks } = data;
  const existing = await head(uid, body.hash);
  if (existing) {
    const chunk = chunks.find((c) => c.hash === body.hash);
    if (chunk) {
      return chunk;
    }
  }
  const aesKey = await readKey(sub, mnemonic);
  if (!aesKey) {
    throw new RequestError(
      `No encryption key for ${mnemonic} in ephemeral storage.`,
    );
  }
  const iv = await crypto.aesKey.generateIv();

  const writeStream = await store(uid, body.hash);
  const validateStream = crypto.stream.validate();
  const encryptStream = crypto.aesKey.encrypt(aesKey, iv);
  const crcStream = crypto.stream.crc32();
  const busboy = new Busboy({ headers: request.header as BusboyHeaders });

  const { crc32, hash, byteCount } = await new Promise<{
    crc32: string;
    hash: string;
    byteCount: number;
  }>((resolve, reject) => {
    busboy.on('file', (_field, file) => {
      writeStream.on('finish', () =>
        resolve({
          crc32: crcStream.digest(),
          ...validateStream.digest(),
        }),
      );
      file
        .pipe(validateStream)
        .pipe(encryptStream)
        .pipe(crcStream)
        .pipe(writeStream);
    });
    busboy.on('error', reject);
    request.req.pipe(busboy);
  });

  if (hash !== body.hash) {
    throw new RequestError(
      `Hash mismatch: Data: ${hash} !== Header: ${body.hash}`,
    );
  }
  if (byteCount != end - start + 1) {
    throw new RequestError(
      `Byte count mismatch: Data: ${byteCount} !== Header: ${end - start + 1}`,
    );
  }

  const dataset = await db.fileData.update({
    where: {
      uid,
      createdBy: sub,
    },
    data: {
      chunks: {
        create: {
          hash,
          iv,
          start,
          end,
          crc: crc32,
        },
      },
    },
    include: {
      chunks: {
        where: {
          hash,
        },
      },
    },
  });
  if (!dataset) {
    throw new RequestError(
      `No dataset found for mnemonic ${mnemonic} and user ${sub}`,
    );
  }
  const chunk = dataset.chunks[0];
  return chunk;
}
