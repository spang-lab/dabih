import { AuthorizationError } from '../errors';
import db from '#lib/db';
import { convertKey } from './util';
import { getHome } from '#lib/database/inodes';
export default async function add(user, body) {
    const { isAdmin } = user;
    if (!isAdmin && body.sub && user.sub !== body.sub) {
        throw new AuthorizationError('Not authorized to add a user');
    }
    const sub = body.sub ?? user.sub;
    const isRootKey = body.isRootKey && isAdmin;
    const key = convertKey(user, body.key, isRootKey);
    await getHome(sub);
    const defaultScope = ['dabih:upload', 'dabih:api'].join(' ');
    const result = await db.user.create({
        data: {
            sub,
            email: body.email,
            scope: defaultScope,
            keys: {
                create: key,
            },
        },
        include: {
            keys: true,
        },
    });
    return result;
}
//# sourceMappingURL=add.js.map