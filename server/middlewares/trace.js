/**
 * trace
 * 为ctx对象添加请求时间及traceid
 */
const operate = require('../util/lib/operate');
module.exports = () => {
    // log(ctx);
    return async (ctx, next) => {
        const traceId = operate.createTraceId(ctx);
        ctx.traceId = traceId;
        await next();
    }
};