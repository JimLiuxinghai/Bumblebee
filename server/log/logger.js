const winston = require('winston');
const onFinished = require('on-finished');
const { format } = require('util');
const DailyRotateFile = require('winston-daily-rotate-file');
const {
    generateFormat,
} = require('./stringify_schema');

const {
    createLogger,
    format: { combine: wfcombine, printf: wfprintf },
} = winston;
const logDir = './logs'

const C = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    MSG: 'HTTP %s %s',
};

const getLogLevel = (statusCode = 200, defaultLevel = C.INFO) => {
    switch (Math.floor(statusCode / 100)) {
        case 5:
            return C.ERROR;
        case 4:
            return C.WARN;
        default:
            return defaultLevel;
    }
};

module.exports = (payload = {}) => {
    const {
        level: defaultLevel = C.INFO,
        msg = C.MSG,
    } = payload;
    const transports = [
        new winston.transports.Console()
    ]
    // @ts-ignore
    const stringifyFormat = generateFormat(payload);
    const winstonLogger = createLogger({
        transports,
        format: wfcombine(wfprintf(stringifyFormat)),
    });
    // winstonLogger.configure({
    //     transports: [
    //         new DailyRotateFile({
    //             filename: `${logDir}/access.log.%DATE%`,
    //             datePattern: 'YYYYMMDDHH',
    //             zippedArchive: true,
    //         })
    //     ]
    // });
    const onResponseFinished = (ctx, info) => {
        info.res = ctx.response;
        info.duration = Date.now() - info.started_at;

        info.level = getLogLevel(info.res.status, defaultLevel);
        
        winstonLogger.log(info)
    };

    return async (ctx, next) => {
        console.log(format, 'format')
        const info = { req: ctx.request, started_at: Date.now() };
        info.message = format(msg, info.req.method, info.req.url);
        let error;
        try {
            await next();
        } catch (e) {
            // catch and throw it later
            error = e;
        } finally {
            onFinished(ctx.response, onResponseFinished.bind(null, ctx, info));
        }

        if (error) {
            throw error;
        }
    };
};
