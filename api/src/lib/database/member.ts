import db from '#lib/db';
import { Member, Permission, PermissionString } from 'src/api/types';

import { AuthorizationError, NotFoundError } from 'src/api/errors';
import mnemonic from 'src/api/download/mnemonic';

export const parsePermission = (permission: string): Permission => {
  switch (permission.toLowerCase()) {
    case 'r':
    case 'read':
      return Permission.READ;
    case 'w':
    case 'write':
      return Permission.WRITE;
    case 'n':
    case 'none':
      return Permission.NONE;
    default:
      throw new Error(`Invalid permission string ${permission}`);
  }
};
export const toPermissionString = (
  permission: Permission,
): PermissionString => {
  switch (permission) {
    case Permission.READ:
      return 'read';
    case Permission.WRITE:
      return 'write';
    case Permission.NONE:
      return 'none';
  }
};

export const hasRead = (sub: string, members: Member[]) => {
  return members.some(
    (member) => member.sub === sub && member.permission !== Permission.NONE,
  );
};
export const hasWrite = (sub: string, members: Member[]) => {
  return members.some(
    (member) => member.sub === sub && member.permission === Permission.WRITE,
  );
};

const hasReadRecursive = async (
  inodeId: bigint | null,
  sub: string,
): Promise<boolean> => {
  if (!inodeId) {
    return false;
  }
  const inode = await db.inode.findUnique({
    where: {
      id: inodeId,
    },
    include: {
      members: {
        where: {
          sub,
          permission: {
            gt: Permission.NONE,
          },
        },
      },
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${inodeId} not found`);
  }
  if (inode.members.length > 0) {
    return true;
  }
  return hasReadRecursive(inode.parentId, sub);
};

export const requireRead = async (mnemonic: string, sub: string) => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
    },
    include: {
      members: {
        where: {
          sub,
          permission: {
            gt: Permission.NONE,
          },
        },
      },
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${mnemonic} not found`);
  }
  if (inode.members.length > 0) {
    return inode;
  }
  if (await hasReadRecursive(inode.parentId, sub)) {
    return inode;
  }
  throw new AuthorizationError(
    `User ${sub} has no read permission for ${mnemonic}`,
  );
};

const hasWriteRecursive = async (
  inodeId: bigint | null,
  sub: string,
): Promise<boolean> => {
  if (!inodeId) {
    return false;
  }
  const inode = await db.inode.findUnique({
    where: {
      id: inodeId,
    },
    include: {
      members: {
        where: {
          sub,
          permission: Permission.WRITE,
        },
      },
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${inodeId} not found`);
  }
  if (inode.members.length > 0) {
    return true;
  }
  return hasWriteRecursive(inode.parentId, sub);
};

export const requireWrite = async (mnemonic: string, sub: string) => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
    },
    include: {
      members: {
        where: {
          sub,
          permission: Permission.WRITE,
        },
      },
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${mnemonic} not found`);
  }
  if (inode.members.length > 0) {
    return inode;
  }
  if (await hasWriteRecursive(inode.parentId, sub)) {
    return inode;
  }
  throw new AuthorizationError(
    `User ${sub} has no write permission for ${mnemonic}`,
  );
};

const getPermissionRecursive = async (
  inodeId: bigint | null,
  sub: string,
): Promise<Permission> => {
  if (!inodeId) {
    return Permission.NONE;
  }
  const inode = await db.inode.findUnique({
    where: {
      id: inodeId,
    },
    include: {
      members: {
        where: {
          sub,
        },
      },
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${inodeId} not found`);
  }
  const member = inode.members[0];
  if (member) {
    return member.permission as Permission;
  }
  return getPermissionRecursive(inode.parentId, sub);
};

export const getPermission = async (mnemonic: string, sub: string) => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
    },
    include: {
      members: {
        where: {
          sub,
        },
      },
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${mnemonic} not found`);
  }
  const member = inode.members[0];
  if (member) {
    return member.permission as Permission;
  }
  return getPermissionRecursive(inode.parentId, sub);
};
