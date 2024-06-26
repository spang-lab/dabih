
import db from "#lib/db";
import crypto from "#crypto";
import { storeKey } from "#lib/keyv";
import { addKeys } from "#lib/database/keys";
import { Permission } from "#lib/database/member";
import { InodeType, getDirectory } from "#lib/database/inode";
import { createBucket } from "#lib/fs";

import { User, UploadStartBody, File } from "../types";
import { RequestError } from "../errors";
import { generateMnemonic, generateDataUid } from "#lib/database/inode";



export default async function start(user: User, body: UploadStartBody): Promise<File> {
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
    fileName, directory, filePath, size, tag,
  } = body;


  let parent = undefined;
  if (directory) {
    const dir = await getDirectory(directory);
    if (!dir) {
      throw new RequestError(`No directory found for mnemonic ${directory}`);
    }
    parent = {
      connect: {
        id: dir.id
      }
    };
  }
  const mnemonic = await generateMnemonic();
  const uid = await generateDataUid();
  const key = await crypto.aesKey.generate();
  const keyHash = crypto.aesKey.toHash(key);

  const data = await db.fileData.create({
    data: {
      uid,
      fileName,
      filePath,
      keyHash,
      size,
      createdBy: sub,
    }
  });
  const inode = await db.inode.create({
    data: {
      mnemonic,
      tag,
      type: InodeType.FILE,
      parent,
      name: fileName,
      data: {
        connect: {
          id: data.id
        }
      },
      members: {
        create: {
          sub,
          permission: Permission.WRITE,
        }
      }
    },
  });
  await storeKey(sub, mnemonic, key);
  await addKeys(mnemonic, key);
  await createBucket(uid);
  return {
    ...inode,
    data,
  };
}


