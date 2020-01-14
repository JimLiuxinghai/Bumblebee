const bodyparser = require('koa-bodyparser');
const json = require('koa-json');
const sendHanler = require('./send');
const trace = require('./trace');
const logMiddleware = require('./log');
const log = require('../util/lib/log');

module.exports = app => {
    // 捕获应用级错误
    app.on('error', (err) => {
        log.error({err: err.stack});
    });

    app
        .use(json())
        .use(
            bodyparser({
                enableTypes: ['json', 'form'],
                formLimit: '50mb',
                jsonLimit: '50mb',
            })
        )
        .use(trace())
        .use(sendHanler())
        .use(logMiddleware())
}