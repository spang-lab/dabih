import logger from '#lib/logger';
const timeToString = (timeMs) => {
    if (timeMs < 1000) {
        return `${timeMs}ms`;
    }
    return `${Math.round(timeMs / 1000)}s`;
};
const log = async (ctx, next) => {
    const start = Date.now();
    const { url, method } = ctx.request;
    await next();
    const timeMs = Date.now() - start;
    const time = timeToString(timeMs);
    const { status } = ctx.response;
    logger.http(`${method} ${url} ${status} ${time}`);
};
export default () => log;
//# sourceMappingURL=log.js.map