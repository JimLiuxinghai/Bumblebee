/**
 * 日志中间件
 */
'use strict';

const log = require('../util/lib/log');
const opreate = require('../util/lib/operate');

module.exports = () => {
    return async (ctx, next) => {
        if (ctx.request.originalUrl === '/favicon.ico') {
            return;
        }
        let ip = opreate.realIp(ctx);
        let startTime = new Date();
        //ctx.errCode = errCode;
        await next();
        let time = (new Date() - startTime) + 'ms';
        log.info({ type: '[HTTP ACCESS]', traceId: ctx.traceId, ip, method: ctx.request.method, url: ctx.request.originalUrl, query: ctx.query, time});
    };
};
