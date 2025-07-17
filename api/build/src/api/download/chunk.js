import { get } from "#lib/fs";
export default async function chunk(uid, hash) {
    const stream = await get(uid, hash);
    return stream;
}
//# sourceMappingURL=chunk.js.map