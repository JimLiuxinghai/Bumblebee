/**
 * trace
 * 为ctx对象添加traceid
 */
const operate = require('../util/lib/operate');
module.exports = () => {
    return async (ctx, next) => {
        const traceId = operate.createTraceId(ctx);
        ctx.traceId = traceId;
        await next();
    }
};