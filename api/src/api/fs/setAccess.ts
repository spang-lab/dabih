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
  await requireWrite(mnemonic, sub);
  const inode = await db.inode.findUnique({
    where: { mnemonic },
    include: {
      members: true,
    },
  });
  if (!inode) {
    throw new RequestError(`Inode ${mnemonic} not found`);
  }

  const { members } = inode;

  const permission = members.find((m) => m.sub === body.sub)?.permission;
  if (!permission) {
    throw new RequestError(
      `User ${body.sub} is not a direct member of ${mnemonic}`,
    );
  }
  const desiredPermission = body.permission;

  const validPermissions = [
    Permission.NONE as number,
    Permission.READ as number,
    Permission.WRITE as number,
  ];
  if (!validPermissions.includes(desiredPermission)) {
    throw new RequestError(
      `Invalid permission: ${desiredPermission}. Valid permissions are: ${validPermissions.join(', ')}`,
    );
  }

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
