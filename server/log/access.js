const ip = require('ip');
/**
 * 记录用户端信息函数
 * @param {any} ctx  全局上下文参数
 * @param {string} message  log 打印信息
 * @param {Object} commonInfo  log 打印公共信息
 * @returns 
 */
module.exports = (ctx, message, commonInfo) => {
    const {
        method,
        url,
        host,
        headers
    } = ctx.request;
    let req = ctx.req;
    
    let clientIP = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    clientIP = clientIP.replace('::ffff:', '');

    const client = {
        clientIP,
        method,
        url,
        host,
        message,
        referer: headers['referer'],
        userAgent: headers['user-agent']
    }
    return JSON.stringify(Object.assign(commonInfo, client));
}