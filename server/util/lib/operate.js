/**
 * Created by Jimliu on 2019/1/11.
 * 后台文件操作函数
 */



const fs = require('fs');
const path = require('path');

const encrypt = require('./encrypt.js');
/**
 * 文件权限
 * @param p
 * @param mode
 * @returns {*}
 */
const chmod = exports.chmod = (p, mode = '0777') => {
    if (!fs.existsSync(p)) {
        return true;
    }
    return fs.chmodSync(p, mode);
};
/**
 * 创建目录
 * @param p
 * @param mode
 * @returns {boolean}
 */
const mkdir = exports.mkdir = (p, mode = '0777') => {
    if (fs.existsSync(p)) {
        chmod(p, mode);
        return true;
    }
    let pp = path.dirname(p);
    if (fs.existsSync(pp)) {
        fs.mkdirSync(p, mode);
    } else {
        mkdir(pp, mode);
        mkdir(p, mode);
    }
    return true;
};
/**
 * 创建目录路径递归
 * @param p
 * @param mode
 * @returns {boolean}
 */
const mkPath = exports.mkPath = (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkPath(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
};

/**
 * 写文件
 * @param dirname 文件路径
 * @param config 配置
 * @returns {Promise}
 */
exports.writeByPromise = (dirname, config = {}) => {

    return new Promise((resolve, reject) => {

        var ws = fs.createWriteStream(dirname, {start: 0});
        var buffer = config.buffer;
        ws.write(buffer, 'utf8', function (err) {
            if(err) {
                reject(err);
                return;
            }
            resolve(arguments);
        });
        ws.end();
    });
};

/**
 * 读文件
 * @param dirname 文件路径
 * @param config 配置
 * @returns {Promise}
 */
exports.readByPromise = (dirname, config = {}) => {

    return new Promise((resolve, reject) => {
        fs.readFile(dirname, function(err, data) {
            if(err) {
                reject(err);
                return;
            }
            resolve(data.toString());
        });
    });
};
/**
 * 获取客户端真实ip
 * @param ctx
 * @returns {*}
 */
exports.clientIp = function clientIp(ctx) {
    return ctx.headers['x-forwarded-for'] || ctx.headers['x-real-ip']
};
/**
 * 获取真实ip
 * @param ctx
 * @returns {*}
 */
exports.realIp = function realIp(ctx) {
    return ctx.headers['x-forwarded-for'] || ctx.headers['x-real-ip']
};

/**
 * 获取请求的唯一uid
 * @param req
 * @returns {*}
 */
exports.createTraceId = function createTraceId(ctx, res) {
    let rid = new Date().getTime();
    let ip = exports.realIp(ctx);
    let cookies = ctx.headers['cookies'] || {};
    return encrypt.md5(rid + ip + ctx.url  + cookies + ctx.method).substring(19);
};

