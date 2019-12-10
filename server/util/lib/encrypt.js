/**
 * Created by Administrator on 2017/9/1.
 * 加密等帮助函数
 */



const crypto = require('crypto');
/**
 * uuid
 * @param length
 * @returns {string}
 */
exports.uuid = function uuid(length = 32) {
    let str = crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length);
    return str.replace(/[\+\/]/g, '_');
};

/**
 * md5
 * @param str
 * @returns {*}
 */
exports.md5 = str => {
    let instance = crypto.createHash('md5');
    instance.update(str + '', 'utf8');
    return instance.digest('hex');
};
/**
 * 随机生成盐
 * @type {Function}
 */
let randomSalt = exports.randomSalt = function (bytes = 12) {
    let buf = crypto.randomBytes(12);
    return buf.toString('hex')
};