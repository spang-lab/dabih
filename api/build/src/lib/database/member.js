import db from '#lib/db';
import { Permission } from '../../../src/api/types';
import { AuthorizationError, NotFoundError } from '../../../src/api/errors';
export const parsePermission = (permission) => {
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
export const toPermissionString = (permission) => {
    switch (permission) {
        case Permission.READ:
            return 'read';
        case Permission.WRITE:
            return 'write';
        case Permission.NONE:
            return 'none';
        default:
            throw new Error(`Invalid permission ${permission}`);
    }
};
export const hasRead = (sub, members) => {
    return members.some((member) => member.sub === sub && member.permission !== Permission.NONE);
};
export const hasWrite = (sub, members) => {
    return members.some((member) => member.sub === sub && member.permission === Permission.WRITE);
};
const hasReadRecursive = async (inodeId, sub) => {
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
export const requireRead = async (mnemonic, sub) => {
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
    throw new AuthorizationError(`User ${sub} has no read permission for ${mnemonic}`);
};
const hasWriteRecursive = async (inodeId, sub) => {
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
export const requireWrite = async (mnemonic, sub) => {
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
    throw new AuthorizationError(`User ${sub} has no write permission for ${mnemonic}`);
};
const getPermissionRecursive = async (inodeId, sub) => {
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
        return member.permission;
    }
    return getPermissionRecursive(inode.parentId, sub);
};
export const getPermission = async (mnemonic, sub) => {
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
        return member.permission;
    }
    return getPermissionRecursive(inode.parentId, sub);
};
//# sourceMappingURL=member.js.map