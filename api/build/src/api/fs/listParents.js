import { AuthorizationError } from '../errors';
import { Permission } from '../types';
import { getParents } from '#lib/database/inode';
export default async function listParents(user, mnemonic) {
    const { sub, isAdmin } = user;
    const parents = await getParents(mnemonic);
    if (!isAdmin) {
        const members = parents.flatMap((parent) => parent.members
            .filter((m) => m.permission !== Permission.NONE)
            .map((m) => m.sub));
        if (!members.includes(sub)) {
            throw new AuthorizationError(`Not authorized to view members for ${mnemonic}`);
        }
    }
    return parents;
}
//# sourceMappingURL=listParents.js.map