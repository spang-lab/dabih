import { Permission } from '../types';
import { AuthorizationError } from '../errors';
import { addKeys } from '#lib/database/keys';
import publicKey from '#lib/database/publicKey';
import db from '#lib/db';
import { getParents } from '#lib/database/inode';
export default async function addMembers(user, mnemonic, body) {
    const parents = await getParents(mnemonic);
    const inode = parents[0];
    const members = parents.flatMap((parent) => parent.members);
    const permission = members.find((m) => m.sub === user.sub)?.permission;
    if (permission !== Permission.WRITE) {
        throw new AuthorizationError(`User ${user.sub} does not have permission to add members to dataset ${mnemonic}`);
    }
    const { subs, keys } = body;
    const publicKeys = await publicKey.listUsers(subs);
    await addKeys(mnemonic, keys, publicKeys);
    const newUsers = subs
        .filter((sub) => !members.find((m) => m.sub === sub))
        .map((sub) => ({
        sub,
        permission: Permission.READ,
    }));
    await db.inode.update({
        where: {
            id: inode.id,
        },
        data: {
            members: {
                createMany: {
                    data: newUsers,
                },
            },
        },
    });
}
//# sourceMappingURL=addMembers.js.map