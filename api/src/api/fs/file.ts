import { FileDownload, User } from "../types";
import db from "#lib/db";

import { AuthorizationError, NotFoundError } from "../errors";
import { InodeType } from "#lib/database/inode";
import { getUserKeys } from "#lib/database/keys";

export default async function file(user: User, mnemonic: string) {
  const { isAdmin, sub } = user;
  const publicKeys = await getUserKeys(sub);
  const file = await db.inode.findUnique({
    where: {
      mnemonic,
      type: InodeType.FILE,
    },
    include: {
      data: {
        include: {
          chunks: true,
          keys: {
            where: {
              hash: {
                in: publicKeys.map(k => k.hash)
              }
            }
          }
        }
      },
    },
  });
  if (!file) {
    throw new NotFoundError(`No file found for mnemonic ${mnemonic}`);
  }
  if (file.deletedAt) {
    throw new Error(`File ${mnemonic} has been deleted`);
  }
  const { data } = file;
  if (!data) {
    throw new Error(`Inode ${mnemonic} has type FILE but no data`);
  }
  const { keys } = data;
  if (keys.length === 0 && !isAdmin) {
    throw new AuthorizationError(`User keys do not match file keys for file ${mnemonic}`);
  }
  return file as FileDownload;
}