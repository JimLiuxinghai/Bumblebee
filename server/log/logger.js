const log4js = require('log4js');
const path = require('path');
const access = require("./access.js");
const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"]
const logDir = path.join(__dirname, '../../logs')

const baseInfo = {
    appLogLevel: 'debug',
    dir: 'logs',
    env: 'dev',
    projectName: 'Bumblebee',
    serverIp: '0.0.0.0'
}

module.exports = (options) => {
    // const logger = log4js.getLogger();
    // logger.level = 'debug';
    // logger.debug("Some debug messages");

    const contextLogger = {}
    const appenders = {}

    const opts = Object.assign({}, baseInfo, options || {})
    const { env, appLogLevel, dir, serverIp, projectName } = opts
    const commonInfo = { projectName, serverIp }
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

    
    const logger = log4js.getLogger('cheese');
 
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