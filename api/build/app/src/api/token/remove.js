import db from '#lib/db';
export default async function remove(user, tokenId) {
    const { sub } = user;
    await db.token.delete({
        where: {
            id: tokenId,
            sub,
        },
    });
}
//# sourceMappingURL=remove.js.map