
import db from "#lib/db";
import mnemonicGen from "#lib/mnemonic";
import crypto from "#crypto";
import { storeKey } from "#lib/keyv";
import { addKeys } from "#lib/database/keys";
import { Permission } from "#lib/database/member";
import { createBucket } from "#lib/fs";

import { User, UploadStartBody, UploadStartResponse } from "../types";
import { RequestError } from "../errors";



export default async function start(user: User, body: UploadStartBody): Promise<UploadStartResponse> {
  const mnemonic = mnemonicGen.generate();
  const { sub } = user;

  const hasPublicKey = await db.user.findFirst({
    where: {
      sub,
      keys: {
        some: {
          enabled: {
            not: null
          }
        }
      }
    },
    include: {
      keys: true
    }
  });
  if (!hasPublicKey) {
    throw new RequestError(`User ${sub} has no public keys for encryption`);
  }



  const {
    name, fileName, size, path, chunkHash,
  } = body;

  let duplicate = null;
  if (chunkHash && size) {
    duplicate = await db.dataset.findFirst({
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
  }

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
  await storeKey(sub, mnemonic, key);
  await addKeys(mnemonic, key);
  await createBucket(mnemonic);
  return {
    ...dataset,
    duplicate: duplicate?.hash ?? null
  };
}


