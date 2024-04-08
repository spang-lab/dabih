
import db, { Permission } from "#lib/db";
import mnemonicGen from "#lib/mnemonic";
import crypto from "#crypto";
import { storeKey } from "#lib/keyv";
import { generateKeys } from "#lib/database/keys";

import { User, UploadStartBody, UploadStartResponse } from "../types";



export default async function start(user: User, body: UploadStartBody): Promise<UploadStartResponse> {
  const mnemonic = mnemonicGen.generate();
  const { sub } = user;
  const {
    name, fileName, size, path, chunkHash,
  } = body;

  const duplicate = await db.dataset.findFirst({
    where: {
      createdBy: sub,
      fileName,
      size,
      hash: {
        not: null
      },
      deletedAt: null,
      chunks: {
        some: {
          start: 0,
          hash: chunkHash,
        },
      },
    },
    include: {
      chunks: true
    }
  });

  const key = await crypto.aesKey.generate();
  const keyHash = crypto.aesKey.toHash(key);


  const dataset = await db.dataset.create({
    data: {
      mnemonic,
      name,
      fileName,
      size,
      keyHash,
      path,
      createdBy: sub,
      members: {
        create: {
          sub,
          permission: Permission.WRITE,
        }
      }
    }
  });
  await storeKey(mnemonic, key);
  await generateKeys(mnemonic);
  return {
    ...dataset,
    duplicate: duplicate?.hash ?? undefined,
  }
}


