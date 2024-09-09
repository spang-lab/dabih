import { AddDirectoryBody, User, InodeType, Permission } from '../types';
import db from '#lib/db';
import { generateMnemonic } from '#lib/database/inode';
import { getPermission } from '#lib/database/member';
import { RequestError, AuthorizationError } from '../errors';
import { getHome } from '#lib/database/inodes';

export default async function addDirectory(user: User, body: AddDirectoryBody) {
  const { sub, isAdmin } = user;

  let parentId;

  if (body.parent) {
    const permission = await getPermission(body.parent, sub);
    if (permission !== Permission.WRITE && !isAdmin) {
      throw new AuthorizationError(
        `Not authorized to add directory to ${body.parent}`,
      );
    }
    const dir = await db.inode.findUnique({
      where: {
        mnemonic: body.parent,
      },
    });
    if (!dir) {
      throw new RequestError(`No directory found for mnemonic ${body.parent}`);
    }
    if ([InodeType.FILE, InodeType.UPLOAD].includes(dir.type)) {
      throw new RequestError(`Parent ${body.parent} is not a directory`);
    }
    parentId = dir.id;
  } else {
    const home = await getHome(sub);
    parentId = home.id;
  }

  const mnemonic = await generateMnemonic();
  const directory = await db.inode.create({
    data: {
      mnemonic,
      tag: body.tag,
      name: body.name,
      type: InodeType.DIRECTORY,
      parent: {
        connect: {
          id: parentId,
        },
      },
    },
  });
  return directory;
}
