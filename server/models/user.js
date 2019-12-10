const crypto = require('crypto');

/**
 * 随机生成盐
 * @type {Function}
 */
let randomSalt = exports.randomSalt = function (bytes = 12) {
    //通过伪随机码生成salt，进行加密
    let buf = crypto.randomBytes(12);
    return buf.toString('hex')
};
/**
 * 随机生成密码
 * @type {Function}
 */
let randomPwd = exports.randomPwd = function (bytes = 8) {
    //通过伪随机码生成密码
    let buf = crypto.randomBytes(8);
    return buf.toString('hex')
};
/**
 * 简单密码校验
 * @returns {number}
 */
exports.isSimplePwd = function(s){
    var ls = 0;
    if(s.match(/([a-z])+/)){
        ls += 2;
    }
    if(s.match(/([0-9])+/)){
        ls += 1;
    }
    if(s.match(/([A-Z])+/)){
        ls += 2;
    }
    if(s.match(/[^a-zA-Z0-9]+/)){
        ls += 3;
    }
    return ls;
};

/**
 * md5
 **/
const md5 = exports.md5 = str => {
    let instance = crypto.createHash('md5');
    instance.update(str + '', 'utf8');
    return instance.digest('hex');
};
/**
 * 密码生成
 *
 * md5(用户名 + md5(密码+盐))
 *
 * @param username
 * @param passwd
 * @param salt
 * @returns {*}
 */
exports.makePasswd = function (username, passwd, salt) {
    return md5(username + md5(passwd + salt));
};

