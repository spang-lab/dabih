import { getPermission } from '#lib/database/member';
import db from '#lib/db';
import { removeBucket } from '#lib/fs';
import { AuthorizationError } from '../errors';
import { Permission } from '../types';
export default async function cancel(user, mnemonic) {
    if (!user.isAdmin) {
        const permission = await getPermission(mnemonic, user.sub);
        if (permission !== Permission.WRITE) {
            throw new AuthorizationError('Not authorized to cancel this upload');
        }
    }
    const file = await db.inode.update({
        where: {
            mnemonic,
        },
        data: {
            data: {
                update: {
                    chunks: {
                        deleteMany: {},
                    },
                },
            },
            keys: {
                deleteMany: {},
            },
        },
        include: {
            data: {
                include: {
                    chunks: true,
                },
            },
            keys: true,
        },
    });
    await db.inode.update({
        where: {
            mnemonic,
        },
        data: {
            members: {
                deleteMany: {},
            },
            data: {
                delete: true,
            },
        },
    });
    await db.inode.delete({
        where: {
            mnemonic,
        },
    });
    const { data } = file;
    if (!data) {
        throw new Error(`Inode ${mnemonic} has type UPLOAD but no data`);
    }
    await removeBucket(data.uid);
}
//# sourceMappingURL=cancel.js.map