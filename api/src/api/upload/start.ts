import db from '#lib/db';
import crypto from '#crypto';
import { storeKey } from '#lib/keyv';
import { addKeys } from '#lib/database/keys';
import publicKey from '#lib/database/publicKey';
import { createBucket } from '#lib/fs';

import { Permission, InodeType, User, UploadStartBody, File } from '../types';
import { AuthorizationError, RequestError } from '../errors';
import { generateMnemonic, generateDataUid } from '#lib/database/inode';
import { getHome } from '#lib/database/inodes';
import { getPermission } from '#lib/database/member';

export default async function start(
  user: User,
  body: UploadStartBody,
): Promise<File> {
  const { sub } = user;
  const userKeys = await publicKey.listUser(sub);
  const rootKeys = await publicKey.listRoot();
  const publicKeys = userKeys.concat(rootKeys);
  if (publicKeys.length === 0) {
    throw new RequestError(`User ${sub} has no public keys for encryption`);
  }
  const { fileName, directory, filePath, size, tag } = body;

  let parent = undefined;
  if (directory) {
    const permission = await getPermission(directory, sub);
    if (permission !== Permission.WRITE) {
      throw new AuthorizationError(
        `Not authorized to add file to ${directory}`,
      );
    }
    const dir = await db.inode.findUnique({
      where: {
        mnemonic: directory,
        type: InodeType.DIRECTORY,
      },
    });
    if (!dir) {
      throw new RequestError(`No directory found for mnemonic ${directory}`);
    }
    parent = {
      connect: {
        id: dir.id,
      },
    };
  } else {
    const home = await getHome(sub);
    parent = {
      connect: {
        id: home.id,
      },
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
    },
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
          id: data.id,
        },
      },
    },
  });
  await storeKey(sub, mnemonic, key);
  await addKeys(mnemonic, [{ mnemonic, key }], publicKeys);
  await createBucket(uid);
  return {
    ...inode,
    data,
  };
}
