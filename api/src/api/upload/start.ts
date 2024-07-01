
import db from "#lib/db";
import crypto from "#crypto";
import { storeKey } from "#lib/keyv";
import { addKeys, getUserKeys } from "#lib/database/keys";
import { Permission } from "#lib/database/member";
import { InodeType } from "#lib/database/inode";
import { createBucket } from "#lib/fs";

import { User, UploadStartBody, File } from "../types";
import { RequestError } from "../errors";
import { generateMnemonic, generateDataUid } from "#lib/database/inode";



export default async function start(user: User, body: UploadStartBody): Promise<File> {
  const { sub } = user;
  const publicKeys = await getUserKeys(sub);
  if (publicKeys.length === 0) {
    throw new RequestError(`User ${sub} has no public keys for encryption`);
  }

  const {
    fileName, directory, filePath, size, tag,
  } = body;


  let parent = undefined;
  if (directory) {
    const dir = await db.inode.findUnique({
      where: {
        mnemonic: directory,
        type: InodeType.DIRECTORY,
      },
    });
    if (!dir) {
      throw new RequestError(`No directory found for mnemonic ${directory}`);
    }
    if (dir.deletedAt) {
      throw new RequestError(`Directory ${directory} has been deleted`);
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
      type: InodeType.UPLOAD,
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


