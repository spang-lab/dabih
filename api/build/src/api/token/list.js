import db from '#lib/db';
import { convertToken } from '#lib/database/token';
export default async function list(user) {
    const { sub } = user;
    const results = await db.token.findMany({
        where: {
            sub,
        },
    });
    return results.map(token => convertToken(token, true));
}
//# sourceMappingURL=list.js.map