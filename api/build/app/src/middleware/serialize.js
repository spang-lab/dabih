import { Stream } from 'stream';
export const convertBigInts = (_key, value) => {
    if (typeof value === 'bigint') {
        return value.toString();
    }
    return value;
};
const serialize = async (ctx, next) => {
    await next();
    const { body } = ctx;
    if (!body ||
        body instanceof Stream ||
        body instanceof Blob ||
        body instanceof ReadableStream ||
        body instanceof Response ||
        Buffer.isBuffer(body)) {
        return;
    }
    ctx.body = JSON.stringify(body, convertBigInts);
};
export default () => serialize;
//# sourceMappingURL=serialize.js.map