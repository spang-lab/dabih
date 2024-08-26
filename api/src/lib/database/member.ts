import db from '#lib/db';
import { Member, Permission, PermissionString } from 'src/api/types';

import { NotFoundError } from 'src/api/errors';

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

const getMembersRecursive = async (
  inodeId: bigint | null,
  hasPermission: Permission,
): Promise<Member[]> => {
  if (!inodeId) {
    return [];
  }
  const inode = await db.inode.findUnique({
    where: {
      id: inodeId,
    },
    include: {
      members: {
        where: {
          permission: {
            gte: hasPermission,
          },
        },
      },
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${inodeId} not found`);
  }
  const members = inode.members.map((m) => ({
    ...m,
    permissionString: toPermissionString(m.permission),
    mnemonic: inode.mnemonic,
  }));

  const parentMembers = await getMembersRecursive(
    inode.parentId,
    hasPermission,
  );
  return [...members, ...parentMembers];
};

export const getMembers = async (
  mnemonic: string,
  hasPermission: Permission,
) => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
    },
    include: {
      members: {
        where: {
          permission: {
            gte: hasPermission,
          },
        },
      },
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${mnemonic} not found`);
  }
  const members = inode.members.map((m) => ({
    ...m,
    permissionString: toPermissionString(m.permission),
    mnemonic,
  }));
  const pMembers = await getMembersRecursive(inode.parentId, hasPermission);
  return {
    ...inode,
    members: [...members, ...pMembers],
  };
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
