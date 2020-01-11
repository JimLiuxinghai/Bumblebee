/**
 * Created by Administrator on 2017/9/1.
 * 日志类函数
 */


const log4js = require('log4js');
const utilLog = log4js.getLogger('[ERROR_LOG]');

const operate = require('./operate.js');
const object = require('./object.js');

exports.error = function (req, config = {}) {
    let ip = req ? operate.clientIp(req) : 'ERROR_LOG';
    let key = req ? operate.createRequestUid(req) : 'ERROR_LOG';
    let url = req.url || 'ERROR_LOG';

    let name = config.name || '';
    let error = config.error || {};
    let errorMsg = error.stack + error.message || 'unknow error';
    config.error = errorMsg;
    let value = JSON.stringify(config);
    utilLog.info(`[${key}]`, `[${ip}]`, `[ERROR_LOG]`, `[${url}]`, `### ${name} --- ${value}`);
};

/**
 * 记录日志
 * @param logger
 * @param options
 */
exports.recordLog = function recordLog(logger, options) {
    const __session = options.req.session || {};
    const userInfo = __session.user_info || {};

    let key = operate.createRequestUid(options.req, options.res);
    let ip = operate.realIp(options.req) || operate.clientIp(options.req);
    let content = options.content;
    if(typeof options.content !== 'string'){
        let pwd;
        if(content.form){
            pwd = content.form.pwd;
        }
        content = JSON.stringify(options.content);
        pwd && (content = content.replace(pwd, '*********'));
    }
    let other = options.other || '';
    if(typeof other !== 'string'){
        other.username = userInfo.login_email || '';
        other = JSON.stringify(other);
    }
    // log info
    let logFn = logger.info;
    // error
    if (options.type === 'error') {
        logFn = logger.error;
    }
    // warn
    if (options.type === 'warn') {
        logFn = logger.warn;
    }
    let log;
    if (options.name) {
        log = `[${key}] [${ip}] [${options.url}] [${options.name}--${options.category}]|${options.req.originalUrl || ''}|${content}${other}|${userInfo.login_email}}`;
    } else {
        log = `[${key}] [${ip}] ${options.req.originalUrl || ''}|${content}${other}`;
    }
    logFn.call(logger, log);
};

let tips = require('./tips.js');
/**
 * 返回提示信息
 * @param err
 */
exports.errorTips = function(err){
    return object.clone(tips[err]);
};
