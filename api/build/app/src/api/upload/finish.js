import db from '#lib/db';
import { NotFoundError, RequestError } from '../errors';
import { InodeType } from '../types';
import { createHash } from 'crypto';
import { deleteKey } from '#lib/redis/aesKey';
export const validChunkEnd = (chunks) => {
    return chunks.reduce((end, chunk) => {
        if (chunk.start === end + BigInt(1)) {
            return chunk.end;
        }
        return -1n;
    }, -1n);
};
const hashChunks = (chunks) => {
    const hash = createHash('sha256');
    for (const chunk of chunks) {
        hash.update(chunk.hash, 'base64url');
    }
    return hash.digest('base64url');
};
export default async function finish(user, mnemonic) {
    const { sub } = user;
    const file = await db.inode.findUnique({
        where: {
            mnemonic,
            type: InodeType.UPLOAD,
        },
        include: {
            data: {
                where: {
                    createdBy: sub,
                },
                include: {
                    chunks: {
                        orderBy: {
                            start: 'asc',
                        },
                    },
                },
            },
        },
    });
    if (!file) {
        throw new NotFoundError(`No upload found for mnemonic ${mnemonic}`);
    }
    const { data } = file;
    if (!data) {
        throw new Error(`Inode ${mnemonic} has type UPLOAD but no data`);
    }
    const { chunks, size } = data;
    const end = validChunkEnd(chunks);
    if (end === BigInt(-1)) {
        throw new RequestError(`Chunks are not complete for dataset ${mnemonic}`);
    }
    if (size && size !== end + BigInt(1)) {
        throw new RequestError(`Dataset size: ${size} does not match chunks end: ${end + BigInt(1)} for dataset ${mnemonic}`);
    }
    const hash = hashChunks(chunks);
    const result = await db.inode.update({
        where: {
            mnemonic,
            type: InodeType.UPLOAD,
        },
        data: {
            type: InodeType.FILE,
            data: {
                update: {
                    hash,
                    size: end + 1n,
                },
            },
        },
        include: {
            data: true,
        },
    });
    await deleteKey(sub, mnemonic);
    return result;
}
//# sourceMappingURL=finish.js.map