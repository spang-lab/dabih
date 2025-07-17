import { Permission } from '../types';
import { AuthorizationError, RequestError } from '../errors';
import { getPermission } from '#lib/database/member';
import { addKeys, removeKeys } from '#lib/database/keys';
import publicKey from '#lib/database/publicKey';
import db from '#lib/db';
import { getParents } from '#lib/database/inode';
export default async function move(user, body) {
    const { sub, isAdmin } = user;
    const { mnemonic } = body;
    if ((await getPermission(mnemonic, sub)) !== Permission.WRITE) {
        throw new AuthorizationError(`Not authorized to move ${mnemonic}`);
    }
    const { name, tag } = body;
    if (name !== undefined || tag !== undefined) {
        await db.inode.update({
            where: { mnemonic },
            data: {
                name,
                tag,
            },
        });
    }
    if (body.parent === undefined) {
        return;
    }
    if (body.parent === null) {
        await db.inode.update({
            where: { mnemonic },
            data: {
                parent: {
                    disconnect: true,
                },
            },
        });
        await removeKeys(mnemonic);
        return;
    }
    const keys = body.keys ?? [];
    const parents = await getParents(body.parent);
    const members = parents.flatMap((parent) => parent.members.filter((m) => m.permission !== Permission.NONE));
    const parentNode = parents[0];
    if (parentNode.mnemonic === mnemonic) {
        throw new RequestError(`Cannot move ${mnemonic} into itself`);
    }
    const permission = members.find((m) => m.sub === sub)?.permission ?? Permission.NONE;
    if (permission !== Permission.WRITE && !isAdmin) {
        throw new AuthorizationError(`User ${sub} does not have permission to move to ${parentNode.mnemonic}`);
    }
    const subs = members.map((member) => member.sub);
    const publicKeys = await publicKey.listUsers(subs);
    await addKeys(mnemonic, keys, publicKeys);
    await db.inode.update({
        where: { mnemonic },
        data: {
            parent: {
                connect: {
                    id: parentNode.id,
                },
            },
        },
    });
    await removeKeys(mnemonic);
}
//# sourceMappingURL=move.js.map