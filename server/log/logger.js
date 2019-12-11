const log4js = require('log4js');
const path = require('path');
const access = require("./access.js");
const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"]
const logDir = path.join(__dirname, '../../logs')

const baseInfo = {
    appLogLevel: 'debug',
    dir: 'logs',
    env: 'dev',
    projectName: 'Bumblebee'
}

module.exports = (options) => {

    const contextLogger = {}
    const appenders = {}

    const opts = Object.assign({}, baseInfo, options || {})
    const { env, appLogLevel, dir, projectName } = opts
    const commonInfo = { projectName }
    appenders.cheese = {
        type: 'dateFile',
        filename: `${logDir}/access.log`,
        pattern: 'yyyyMMdd',
        alwaysIncludePattern: true
    }

    if (env.match("development")) {
        appenders.out = {
            type: "console"
        }
    }
    
    let config = {
        appenders,
        categories: {
            default: {
                appenders: Object.keys(appenders),
                level: appLogLevel
            }
        },
        replaceConsole: true,
        pm2: true, 
        disableClustering: true
    }

    log4js.configure(config);
    log4js.addLayout('json', function (config) {
        return function (logEvent) { return JSON.stringify(logEvent) + config.separator; }
    });

    
    const logger = log4js.getLogger('[HTTP:ACCESS]');

    return async (ctx, next) => {
        const start = Date.now()
        methods.forEach((method, i) => {
            contextLogger[method] = (message) => {
                logger[method](access(ctx, message, commonInfo))
            }
        })

        ctx.log = contextLogger;
        await next()
        const responseTime = Date.now() - start;
        
        logger.info(access(ctx, {
            responseTime: `响应时间为${responseTime / 1000}s`
        }, commonInfo))
    }
}