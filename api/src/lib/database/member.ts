import db from "#lib/db";
import { Member } from "@prisma/client";

import { NotFoundError } from "src/api/errors";

export enum Permission {
  NONE = 0,
  READ = 1,
  WRITE = 2,
}

export const parsePermission = (permission: string): Permission => {
  switch (permission.toLowerCase()) {
    case 'read':
      return Permission.READ;
    case 'write':
      return Permission.WRITE;
    case 'none':
      return Permission.NONE;
    default:
      throw new Error(`Invalid permission string ${permission}`);
  }
}

const getMembersRecursive = async (inodeId: number | null, hasPermission: Permission): Promise<Member[]> => {
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
        }
      }
    }
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${inodeId} not found`);
  }
  const parentMembers = await getMembersRecursive(inode.parentId, hasPermission);
  return [...parentMembers, ...inode.members];
}


export const getMembers = async (mnemonic: string, hasPermission: Permission) => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${mnemonic} not found`);
  }
  return getMembersRecursive(inode.id, hasPermission);
}

const getPermissionRecursive = async (inodeId: number | null, sub: string): Promise<Permission> => {
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
        }
      }
    }
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${inodeId} not found`);
  }
  const member = inode.members[0];
  if (member) {
    return member.permission;
  }
  return getPermissionRecursive(inode.parentId, sub);
}

export const getPermission = async (mnemonic: string, sub: string) => {
  const inode = await db.inode.findUnique({
    where: {
      mnemonic,
    },
  });
  if (!inode) {
    throw new NotFoundError(`Inode ${mnemonic} not found`);
  }
  return getPermissionRecursive(inode.id, sub);
}
