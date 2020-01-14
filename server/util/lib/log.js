/*
 * @Description: 日志封装
 * @Author: jimliu
 * @Date: 2020-01-13 14:21:08
 */

const DailyRotateFile = require('winston-daily-rotate-file');
const { createLogger, transports, format } = require('winston');

const { combine, timestamp, printf } = format;

let _transports = null;

const config = require(`../../../config/env/${process.env.NODE_ENV}`);
//开发环境不写入日志
if (!process.env.NODE_ENV.match('development')) {
    _transports = [new DailyRotateFile(config.logger)];
} else {
    _transports = [new transports.Console({
        name: 'dev',
        level: 'debug',
        json: true,
        colorize: 'all',
        localTime: true
    })];
}

const logger = createLogger({
    transports: _transports,
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss:SSS',
        }),
        printf(info => {
            
            let splatInfo = info[Symbol.for('splat')];
            const { level, message, timestamp } = info;
            if (level.indexOf('error') !== -1) {
                //console.error(info.timestamp, message, splatInfo ? splatInfo : ''); // eslint-disable-line
            }
            let returnObj = {
                ...message,
                timestamp,
                level
            }
            return JSON.stringify(returnObj);
        })
    ),
});

module.exports = logger;
