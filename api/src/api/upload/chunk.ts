

import { ChunkAddBody, RequestWithHeaders } from '../types';
import { readKey } from "#lib/keyv";
import { RequestError } from "../errors";
import crypto from "#crypto";
import db from "#lib/db";
import { head, store } from "#lib/fs";
import Busboy, { BusboyHeaders } from "@fastify/busboy";


export default async function chunk(
  body: ChunkAddBody,
  request: RequestWithHeaders,
) {
  const { mnemonic, start, end } = body;
  const { user } = request;
  const { sub } = user;

  const existing = await head(mnemonic, body.hash);
  if (existing) {
    const dataset = await db.dataset.findUnique({
      where: {
        mnemonic,
        createdBy: sub,
      },
      include: {
        chunks: {
          where: {
            hash: body.hash,
          }
        }
      }
    });
    const chunk = dataset?.chunks[0];
    if (chunk) {
      return chunk;
    }
  }

  const aesKey = await readKey(mnemonic);
  if (!aesKey) {
    throw new RequestError(`No encryption key for ${mnemonic} in ephemeral storage.`);
  }
  const iv = await crypto.aesKey.generateIv();

  const writeStream = await store(mnemonic, body.hash);
  const validateStream = crypto.stream.validate();
  const encryptStream = crypto.aesKey.encrypt(aesKey, iv);
  const crcStream = crypto.stream.crc32();

  const busboy = new Busboy({ headers: request.header as BusboyHeaders });

  const { crc32, hash, byteCount } = await new Promise<{ crc32: string, hash: string, byteCount: number }>((resolve, reject) => {
    busboy.on('file', (_field, file) => {
      writeStream.on('finish', () => resolve({
        crc32: crcStream.digest(),
        ...validateStream.digest(),
      }));
      file
        .pipe(validateStream)
        .pipe(encryptStream)
        .pipe(crcStream)
        .pipe(writeStream);
    });
    //busboy.on('finish', () => { });
    busboy.on('error', reject);
    request.req.pipe(busboy);
  });

  if (hash !== body.hash) {
    throw new RequestError(`Hash mismatch: Data: ${hash} !== Header: ${body.hash}`);
  }
  if (byteCount != end - start + 1) {
    throw new RequestError(`Byte count mismatch: Data: ${byteCount} !== Header: ${end - start + 1}`);
  }

  const dataset = await db.dataset.update({
    where: {
      mnemonic,
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
        }
      }
    },
    include: {
      chunks: true,
    }
  });
  if (!dataset) {
    throw new RequestError(`No dataset found for mnemonic ${mnemonic} and user ${sub}`);
  }
  const chunk = dataset.chunks[0];
  return chunk;
}
