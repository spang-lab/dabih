import { Request } from 'koa';
import { RequestWithUser } from '../types';
import { RequestError } from '../errors';
import uploadStart from './start';
import uploadFinish from './finish';
import db from '#lib/db';
import { readKey } from '#lib/redis/aesKey';
import crypto from '#lib/crypto/index';
import { store } from '#lib/fs/index';
import { Readable } from 'stream';
type RequestWithHeaders = Request & RequestWithUser;

const defaultChunkSize = 2 * 1024 * 1024; // 2MB

const handleChunk = async (
  uid: string,
  aesKey: string,
  chunkData: Buffer,
  start: number,
) => {
  const hash = crypto.hash.buffer(chunkData);
  const iv = await crypto.aesKey.generateIv();
  const writeStream = await store(uid, hash);
  const validateStream = crypto.stream.validate();
  const encryptStream = crypto.aesKey.encrypt(aesKey, iv);
  const crcStream = crypto.stream.crc32();
  const { crc32, byteCount } = await new Promise<{
    crc32: string;
    byteCount: number;
  }>((resolve, reject) => {
    writeStream.on('finish', () =>
      resolve({
        crc32: crcStream.digest(),
        ...validateStream.digest(),
      }),
    );
    writeStream.on('error', reject);
    Readable.from(chunkData)
      .pipe(validateStream)
      .pipe(encryptStream)
      .pipe(crcStream)
      .pipe(writeStream);
  });
  const end = start + byteCount - 1;
  await db.fileData.update({
    where: {
      uid,
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
  });
  console.log(`Uploaded chunk ${hash} (${start}-${end})`);
};

export default async function stream(
  request: RequestWithHeaders,
  mnemonic: string,
  filename: string,
) {
  const chunkSize = request.headers['x-chunk-size']
    ? parseInt(request.headers['x-chunk-size'] as string, 10)
    : defaultChunkSize;

  if (isNaN(chunkSize) || chunkSize <= 0) {
    throw new RequestError('Invalid X-Chunk-Size header value');
  }
  console.log('Chunk Size:', chunkSize);

  const contentLength = request.headers['content-length'];

  const size = contentLength ? parseInt(contentLength, 10) : undefined;

  const { user } = request;
  const { sub } = user;
  const inode = await uploadStart(user, {
    fileName: filename,
    directory: mnemonic,
    size,
  });
  const { data } = inode;
  const { uid } = data;

  const aesKey = await readKey(sub, inode.mnemonic);
  if (!aesKey) {
    throw new RequestError(
      `No encryption key for ${inode.mnemonic} in ephemeral storage.`,
    );
  }

  let buffer = Buffer.alloc(0);
  let start = 0;
  for await (const data of request.req) {
    buffer = Buffer.concat([buffer, data]);
    while (buffer.length >= chunkSize) {
      const chunkData = buffer.subarray(0, chunkSize);
      buffer = buffer.subarray(chunkSize);
      await handleChunk(uid, aesKey, chunkData, start);
      start += chunkData.length;
    }
  }
  if (buffer.length > 0) {
    await handleChunk(uid, aesKey, buffer, start);
  }

  const result = await uploadFinish(user, inode.mnemonic);
  return result;
}
