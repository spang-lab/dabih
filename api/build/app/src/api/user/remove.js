import db from "#lib/db";
import { AuthorizationError } from "../errors";
export default async function remove(user, sub) {
    const { isAdmin } = user;
    if (!isAdmin && sub !== user.sub) {
        throw new AuthorizationError('Not authorized to remove this user');
    }
    await db.user.update({
        where: {
            sub,
        },
        data: {
            keys: {
                deleteMany: {},
            },
        }
    });
    await db.user.delete({
        where: {
            sub,
        }
    });
}
//# sourceMappingURL=remove.js.map