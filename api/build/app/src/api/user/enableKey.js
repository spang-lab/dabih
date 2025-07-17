import { AuthorizationError } from "../errors";
import db from "#lib/db";
export default async function enableKey(user, body) {
    if (!user.isAdmin) {
        throw new AuthorizationError('Not authorized to enable key');
    }
    const data = {
        enabled: (body.enabled) ? new Date() : null,
        enabledBy: (body.enabled) ? user.sub : null,
    };
    const result = await db.user.update({
        where: {
            sub: body.sub,
        },
        data: {
            keys: {
                updateMany: {
                    where: {
                        hash: body.hash,
                    },
                    data,
                }
            },
        },
        include: {
            keys: true,
        }
    });
    const keyData = result.keys.find(k => k.hash === body.hash);
    if (!keyData) {
        throw new Error('Should never happen, key not found after enable');
    }
    return keyData;
}
//# sourceMappingURL=enableKey.js.map