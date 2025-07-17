import { Permission, InodeType } from '../types';
import { AuthorizationError, NotFoundError, RequestError } from '../errors';
import { getPermission } from '#lib/database/member';
import { generateMnemonic } from '#lib/database/inode';
import db from '#lib/db';
const duplicateRecursive = async (inode, parentId) => {
    const children = await db.inode.findMany({
        where: {
            parentId: inode.id,
        },
        include: {
            data: true,
            members: true,
        },
    });
    const data = inode.data
        ? {
            connect: {
                id: inode.data.id,
            },
        }
        : undefined;
    const parent = parentId
        ? {
            connect: {
                id: parentId,
            },
        }
        : undefined;
    const newInode = await db.inode.create({
        data: {
            mnemonic: await generateMnemonic(),
            name: inode.name,
            tag: inode.tag,
            type: inode.type,
            parent,
            data,
            members: {
                createMany: {
                    data: inode.members.map((member) => ({
                        sub: member.sub,
                        permission: member.permission,
                    })),
                },
            },
        },
        include: {
            data: true,
            members: true,
        },
    });
    const childrenPromises = children.map(async (child) => duplicateRecursive(child, newInode.id));
    await Promise.all(childrenPromises);
    return newInode;
};
export default async function duplicate(user, mnemonic) {
    const { sub, isAdmin } = user;
    if (!isAdmin) {
        const permission = await getPermission(mnemonic, sub);
        if (permission !== Permission.WRITE) {
            throw new AuthorizationError(`You do not have permission to duplicate ${mnemonic}`);
        }
    }
    const root = await db.inode.findUnique({
        where: {
            mnemonic,
        },
        include: {
            data: true,
            members: true,
        },
    });
    if (!root) {
        throw new NotFoundError(`No inode found for mnemonic ${mnemonic}`);
    }
    if (root.type !== InodeType.DIRECTORY && root.type !== InodeType.FILE) {
        throw new RequestError(`Unexpected: Inode ${mnemonic} is not a directory or file`);
    }
    const new_name = `${root.name}_copy`;
    const newRoot = await duplicateRecursive(root, root.parentId);
    await db.inode.update({
        where: {
            id: newRoot.id,
        },
        data: {
            name: new_name,
        },
    });
    return newRoot;
}
//# sourceMappingURL=duplicate.js.map