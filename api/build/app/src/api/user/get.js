import db from '#lib/db';
export default async function get(sub) {
    const result = await db.user.findUnique({
        where: {
            sub,
        },
        include: {
            keys: true,
        },
    });
    return result;
}
//# sourceMappingURL=get.js.map