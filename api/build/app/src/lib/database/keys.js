import db from '#lib/db';
import crypto from '#crypto';
import { InodeType, Permission, } from 'src/api/types';
import { RequestError } from 'src/api/errors';
import publicKey from './publicKey';
import { getParents } from './inode';
export const listKeys = async (mnemonic, hashes) => {
    const where = hashes
        ? {
            hash: {
                in: hashes,
            },
        }
        : {};
    const inode = await db.inode.findUnique({
        where: {
            mnemonic,
        },
        include: {
            children: true,
            data: true,
            keys: {
                where,
            },
        },
    });
    if (!inode) {
        return [];
    }
    const { type } = inode;
    if (type === InodeType.FILE || type === InodeType.UPLOAD) {
        return [inode];
    }
    const promises = inode.children.map((child) => listKeys(child.mnemonic, hashes));
    const childLists = await Promise.all(promises);
    return childLists.flat();
};
export const addKeys = async (mnemonic, decryptionKeys, publicKeys) => {
    const hashedKeys = decryptionKeys.map((k) => ({
        ...k,
        hash: crypto.aesKey.toHash(k.key),
    }));
    const hashes = publicKeys.map((k) => k.hash);
    const files = await listKeys(mnemonic, hashes);
    const decryptableFiles = files.map((file) => {
        const { data, mnemonic } = file;
        const decryptionKey = hashedKeys.find((k) => k.mnemonic === mnemonic);
        if (!decryptionKey) {
            throw new RequestError(`No decryption key provided for file ${mnemonic}`);
        }
        if (decryptionKey.hash !== data.keyHash) {
            throw new RequestError(`Decryption key provided for file ${mnemonic} does not match`);
        }
        return {
            ...file,
            aesKey: decryptionKey.key,
        };
    });
    const promises = decryptableFiles.map(async (file) => {
        const { aesKey } = file;
        const keys = publicKeys
            .filter((publicKey) => !file.keys.find((k) => k.hash === publicKey.hash))
            .map((publicKey) => {
            const pubKey = crypto.publicKey.fromString(publicKey.data);
            const encrypted = crypto.publicKey.encrypt(pubKey, aesKey);
            return {
                hash: publicKey.hash,
                key: encrypted,
            };
        });
        return db.inode.update({
            where: {
                mnemonic: file.mnemonic,
            },
            data: {
                keys: {
                    createMany: {
                        data: keys,
                    },
                },
            },
            include: {
                keys: true,
            },
        });
    });
    await Promise.all(promises);
};
const removeKeysRecursive = async (mnemonic, validKeys) => {
    const inode = await db.inode.findUnique({
        where: {
            mnemonic,
        },
        include: {
            children: true,
            keys: true,
            members: true,
        },
    });
    if (!inode) {
        return;
    }
    const newSubs = inode.members
        .filter((m) => !validKeys.find((k) => k.userId === m.id))
        .map((m) => m.sub);
    const userKeys = (await publicKey.listUsers(newSubs));
    const publicKeys = userKeys.concat(validKeys);
    const { type } = inode;
    if (type === InodeType.FILE || type === InodeType.UPLOAD) {
        const hashes = publicKeys.map((k) => k.hash);
        await db.inode.update({
            where: {
                mnemonic,
            },
            data: {
                keys: {
                    deleteMany: {
                        hash: {
                            notIn: hashes,
                        },
                    },
                },
            },
        });
    }
    const promises = inode.children.map((child) => removeKeysRecursive(child.mnemonic, publicKeys));
    await Promise.all(promises);
};
export const removeKeys = async (mnemonic) => {
    const parents = await getParents(mnemonic);
    const subs = parents.flatMap((parent) => parent.members
        .filter((m) => m.permission !== Permission.NONE)
        .map((m) => m.sub));
    const publicKeys = await publicKey.listUsers(subs);
    const rootKeys = await publicKey.listRoot();
    const validKeys = publicKeys.concat(rootKeys);
    await removeKeysRecursive(mnemonic, validKeys);
};
//# sourceMappingURL=keys.js.map