import db from '#lib/db';
const listUsers = async (subs) => {
    const deduped = Array.from(new Set(subs));
    const users = await db.user.findMany({
        where: {
            sub: {
                in: deduped,
            },
        },
        include: {
            keys: {
                where: {
                    enabled: {
                        not: null,
                    },
                },
            },
        },
    });
    if (users.length !== deduped.length) {
        const missing = deduped.filter((sub) => !users.find((u) => u.sub === sub));
        throw new Error(`Some users were not found, missing: ${missing.join(', ')}`);
    }
    const publicKeys = users.flatMap((u) => u.keys);
    return publicKeys;
};
const listUser = async (sub) => {
    const result = await db.user.findUnique({
        where: {
            sub,
        },
        include: {
            keys: {
                where: {
                    enabled: {
                        not: null,
                    },
                },
            },
        },
    });
    return result?.keys ?? [];
};
const listRoot = async () => {
    return db.publicKey.findMany({
        where: {
            enabled: {
                not: null,
            },
            isRootKey: true,
        },
        include: {
            user: true,
        },
    });
};
const publicKey = {
    listUsers,
    listUser,
    listRoot,
};
export default publicKey;
//# sourceMappingURL=publicKey.js.map