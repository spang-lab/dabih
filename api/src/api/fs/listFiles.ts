import { getUserKeys } from "#lib/database/keys";
import db from "#lib/db";
import { Permission, getPermission } from "#lib/database/member";
import { AuthorizationError } from "../errors";
import { FileKeys, User } from "../types";
import { InodeType } from "#lib/database/inode";

const list = async (mnemonic: string, hashes: string[]): Promise<FileKeys[]> => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
      deletedAt: null,
    },
    include: {
      children: true,
      data: {
        include: {
          keys: {
            where: {
              hash: {
                in: hashes,
              },
            },
          },
        },
      },
    },
  });
  if (!inode) {
    return [];
  }
  const type = inode.type as InodeType;
  if (type === InodeType.UPLOAD) {
    return [];
  }
  if (type === InodeType.FILE) {
    return [inode as FileKeys];
  }
  const promises = inode.children.map(child => list(child.mnemonic, hashes));
  const childLists = await Promise.all(promises);
  return childLists.flat();
}


export default async function listFiles(user: User, mnemonic: string) {
  const { sub, isAdmin } = user;
  if (!isAdmin) {
    const permission = await getPermission(mnemonic, sub);
    if (permission === Permission.NONE) {
      throw new AuthorizationError(`Not authorized to list ${mnemonic}`);
    }
  }
  const publicKeys = await getUserKeys(sub);
  const hashes = publicKeys.map(k => k.hash);
  const files = await list(mnemonic, hashes);
  return files;
}
