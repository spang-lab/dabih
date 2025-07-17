import { generateValue, convertToken } from '#lib/database/token';
import db from '#lib/db';
export default async function add(user, body) {
    const { sub } = user;
    const { scopes, lifetime } = body;
    scopes.forEach(scope => {
        if (!user.scopes.includes(scope)) {
            throw new Error(`Cannot request scope ${scope} for token, user does not have it`);
        }
    });
    const value = await generateValue();
    let exp = null;
    if (lifetime !== null) {
        const nowMs = new Date().getTime();
        const expMs = nowMs + lifetime * 1000;
        exp = new Date(expMs);
    }
    const result = await db.token.create({
        data: {
            value,
            sub,
            scope: scopes.join(' '),
            exp,
        }
    });
    const token = convertToken(result, false);
    return token;
}
//# sourceMappingURL=add.js.map