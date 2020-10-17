const koaBody = require('koa-body');
const json = require('koa-json');
const sendHanler = require('./send');
const trace = require('./trace');
const logMiddleware = require('./log');
const log = require('../util/lib/log');
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
module.exports = app => {
    // 捕获应用级错误
    app.on('error', (err) => {
        log.error({err: err.stack});
    });
    app
        .use(json())
        .use(
            koaBody({
                multipart: true,
                formidable: {
                    maxFileSize: 900000 * 1024 * 1024, // 设置上传文件大小最大限制，默认900M
                },
            })
        )
        .use(session({
            key: ENV_CONFIG.sessionKey,
            prefix: ENV_CONFIG.secretKey,
            store: redisStore(ENV_CONFIG.db.redis), //redis 共享session
            domain: ENV_CONFIG.domain,
            cookie: {
                signed: false
            }
        }))
        .use(trace())
        .use(sendHanler())
        .use(logMiddleware())
}