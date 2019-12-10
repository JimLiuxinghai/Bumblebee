/**
 * Created by Administrator on 2017/9/1.
 * 前端cookie常用函数
 */

/**
 * 设置cookie
 * @param  {String} name    cookie名
 * @param  {String} value   cookie值
 * @param  {Object} options 设置cookie的有效期，路径，域，安全
 * @return
 */
exports.set = (name, value, options) => {
    options = options || {};
    //如果值为空，删除该cookie
    if (!value) {
        value = '';
        options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
            date = options.expires;
        }
        expires = '; expires=' + date.toUTCString();
    }
    //设置参数
    var path = options.path ? `; path=${options.path}` : '';
    var domain = options.domain ? `; domain=${options.domain}` : '';
    var secure = options.secure ? `; secure` : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
};

/**
 * 获取cookie
 * @param  {String} name cookie名
 * @return {String}
 */
exports.get = (name) => {
    let dck = document.cookie;
    let cookieStart, cookieEnd;
    if (dck && dck != '') {
        //通过indexOf()来检查这个cookie是否存在，不存在就为 -1　
        cookieStart = dck.indexOf(name + '=');
        if (cookieStart != -1) {
            cookieStart += name.length + 1;
            cookieEnd = dck.indexOf(';', cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = dck.length;
            }
            return decodeURIComponent(dck.substring(cookieStart, cookieEnd));
        }
    }
    return '';
};

/**
 * setCache 后台cookie相关函数
 * @type {Function}
 */
exports.setCache = function (res, key, auth_token, options) {
    res.cookie(key, auth_token, options);
};