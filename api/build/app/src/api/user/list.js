import db from "#lib/db";
export default async function list() {
    return await db.user.findMany({
        include: {
            keys: true,
        }
    });
}
//# sourceMappingURL=list.js.map