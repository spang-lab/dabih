import { AuthorizationError } from '../errors';
import db from '#lib/db';
export default async function removeKey(user, body) {
    if (!user.isAdmin && user.sub !== body.sub) {
        throw new AuthorizationError('Not authorized to remove key');
    }
    const result = await db.user.update({
        where: {
            sub: body.sub,
        },
        data: {
            keys: {
                deleteMany: {
                    hash: body.hash,
                },
            },
        },
        include: {
            keys: true,
        },
    });
    return result;
}
//# sourceMappingURL=removeKey.js.map