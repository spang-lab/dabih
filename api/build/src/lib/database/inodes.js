import db from '#lib/db';
import logger from '#lib/logger';
import { InodeType, Permission } from '../../../src/api/types';
import { generateMnemonic } from './inode';
export const initInodes = async () => {
    logger.info('Initializing root inode');
    try {
        await getRoot();
    }
    catch {
        await db.inode.create({
            data: {
                mnemonic: await generateMnemonic(),
                type: InodeType.ROOT,
                name: 'root',
            },
        });
    }
};
export const getRoot = async () => {
    const root = await db.inode.findFirst({
        where: {
            type: InodeType.ROOT,
            parent: null,
        },
    });
    if (!root) {
        throw new Error('Root inode not found. This should never happen');
    }
    return root;
};
export const getHome = async (sub) => {
    const home = await db.inode.findFirst({
        where: {
            type: InodeType.HOME,
            members: {
                some: {
                    sub,
                },
            },
        },
        include: {
            members: true,
        },
    });
    if (home) {
        return home;
    }
    const root = await getRoot();
    const user = await db.user.findUnique({
        where: {
            sub,
        },
    });
    return db.inode.create({
        data: {
            mnemonic: await generateMnemonic(),
            name: user?.email ?? sub,
            parent: {
                connect: {
                    id: root.id,
                },
            },
            type: InodeType.HOME,
            members: {
                create: {
                    sub,
                    permission: Permission.WRITE,
                },
            },
        },
        include: {
            members: true,
        },
    });
};
export const getTrash = async (sub) => {
    const home = await getHome(sub);
    const trash = await db.inode.findFirst({
        where: {
            type: InodeType.TRASH,
            parent: {
                id: home.id,
            },
        },
    });
    if (trash) {
        return trash;
    }
    return db.inode.create({
        data: {
            mnemonic: await generateMnemonic(),
            name: 'Bin',
            parent: {
                connect: {
                    id: home.id,
                },
            },
            type: InodeType.TRASH,
        },
    });
};
//# sourceMappingURL=inodes.js.map