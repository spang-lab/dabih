import { AddDirectoryBody, User, InodeType, Permission } from '#types';
import db from '#lib/db';
import { generateMnemonic } from '#lib/database/inode';
import { getPermission } from '#lib/database/member';
import { RequestError, AuthorizationError } from '../errors';

export default async function addDirectory(user: User, body: AddDirectoryBody) {
  const { sub, isAdmin } = user;

  let parent = undefined;
  if (body.parent) {
    const permission = await getPermission(body.parent, user.sub);
    if (permission !== Permission.WRITE && !isAdmin) {
      throw new AuthorizationError(
        `Not authorized to add directory to ${body.parent}`,
      );
    }
    const dir = await db.inode.findUnique({
      where: {
        mnemonic: body.parent,
        type: InodeType.DIRECTORY,
      },
    });
    if (!dir) {
      throw new RequestError(`No directory found for mnemonic ${body.parent}`);
    }
    parent = {
      connect: {
        id: dir.id,
      },
    };
  }

  const mnemonic = await generateMnemonic();
  const directory = await db.inode.create({
    data: {
      mnemonic,
      tag: body.tag,
      name: body.name,
      type: InodeType.DIRECTORY,
      parent,
      members: {
        create: {
          sub,
          permission: Permission.WRITE,
        },
      },
    },
  });
  return directory;
}
