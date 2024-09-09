import { RequestError } from '../errors';
import { User, SetAccessBody, Permission } from '../types';
import db from '#lib/db';
import { requireWrite } from '#lib/database/member';
import { removeKeys } from '#lib/database/keys';

export default async function setAccess(
  user: User,
  mnemonic: string,
  body: SetAccessBody,
) {
  const { sub } = user;
  const inode = await requireWrite(mnemonic, sub);
  const { members } = inode;

  const permission = members.find((m) => m.sub === body.sub)
    ?.permission as Permission;
  if (!permission) {
    throw new RequestError(
      `User ${body.sub} is not a direct member of ${mnemonic}`,
    );
  }
  const desiredPermission = body.permission;
  if (permission === desiredPermission) {
    return;
  }
  if (desiredPermission === Permission.NONE) {
    await db.inode.update({
      where: { mnemonic },
      data: {
        members: {
          deleteMany: {
            sub: body.sub,
          },
        },
      },
    });
    await removeKeys(mnemonic);
  } else {
    await db.inode.update({
      where: { mnemonic },
      data: {
        members: {
          update: {
            where: {
              sub_inodeId: {
                sub: body.sub,
                inodeId: inode.id,
              },
            },
            data: {
              permission: desiredPermission,
            },
          },
        },
      },
    });
  }
}
