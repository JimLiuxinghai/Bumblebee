/**
 * trace
 * 为ctx对象添加traceid
 */
module.exports = () => {
    return async (ctx, next) => {
        const traceId = util.operate.createTraceId(ctx);
        ctx.traceId = traceId;
        await next();
    }
};