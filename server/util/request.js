const request = require('request');
const log4js = require('log4js');
const logger = log4js.getLogger('[API]');
/**
 * request()(req, {}).then();
 *
 * 后端接口
 *
 * @returns {Function}
 */
module.exports = function (req, res) {
    return (options)=> {
        let ip = util.operate.realIp(req) || util.operate.clientIp(req);

        // data
        options.data = options.data || {};

        const method = (options.type || 'POST').toUpperCase();

        let db_env = req.session.db_env;
        if(!db_env){
            db_env = prodEnvList.indexOf(SERVER_ENV) === -1 ? 'test' : SERVER_ENV;
        }
        let apiConfig = ENV_CONFIG.api[db_env][options.api];
        options.headers = util.object.extend(options.headers || {}, apiConfig.data || {});

        let url = (apiConfig.url || '') + options.url;
        // 设置cookie
        let token = req.session.user_token;
        if(!token){
            token = req.cookies['U'];
        }
        //TODO:兼容phptoken
        if (options.api === 'php') {
            let suffix = '?';
            if (url.indexOf('?') > -1) {
                suffix = '&'
            }
            url = `${url}${suffix}token=${token}`;
        }
        let j = request.jar();
        if(token){
            let cookie = request.cookie(`RMSTOKEN=${token}`);
            j.setCookie(cookie, options.api);
        }

        // 参数配置
        let param = {
            method: method,
            uri: url,
            //useQuerystring: true,
            // 忽略证书
            strictSSL: false,
            jar: j
        };


        if(options.timeout){
            param.timeout = options.timeout * 1000;
        }

        // get请求时，走querystring
        if(method === 'GET'){
            param.qs = options.data;
            token && (param.qs.token = token);
        } else {

            if (options.isBodyData) {
                param.json = options.data;
            } else {
                param.form = options.data;
                if(token){
                    param.form.token = token;
                }
            }

        }
        // header
        param.headers = {
            'client-ip': ip,
            'User-Agent': req.userAgent,
            'RMSTOKEN': token
        };
        param.headers = util.object.extend(param.headers, options.headers || {});
        // 记录传入的参数
        util.log.recordLog(logger, {
            req,
            res,
            url,
            name: 'REQ',
            category: 'OPTIONS',
            content: param
        });
        return new Promise((resolve, reject) => {

            request(param, (err, request, body) => {
                // 错误记录
                if (err) {
                    resolve(util.errorModal('ERR_SYSTEM_ERROR'));
                    return util.log.recordLog(logger, {
                        req,
                        res,
                        url,
                        name: 'RES',
                        category: 'ERROR',
                        type: 'error',
                        content: param,
                        other: `|${JSON.stringify(err)}`
                    });
                }

                let data = body;
                try {
                    data = typeof data === 'string' ? JSON.parse(data) : data;
                } catch (err) {
                    resolve(util.errorModal('ERR_SYSTEM_ERROR'));
                    data = null;
                    console.log(body);
                    util.log.recordLog(logger, {
                        req,
                        res,
                        url,
                        name: 'RES',
                        category: 'ERROR_SYS',
                        type: 'error',
                        content: param,
                        other: `|${err.message}`
                    });
                    return;
                }
                // 兼容2套不同的api
                let returnData = {
                    "status": {
                        "code": 200,
                        "msg": "OK"
                    },
                    "data": {}
                };
                if(typeof data.data === 'string'){
                    returnData.data = data.data;
                } else {
                    returnData.data = data.data || data.dataInfo || data.result;
                }

                // 登录的和其他的不一致
                if(!data.code && data.status.code){
                    returnData.status.code = data.status.code;
                    returnData.status.msg = data.status.msg;
                } else {
                    returnData.status.code = data.status || data.code;
                    returnData.status.msg = data.des || data.msg || data.info;
                }

                resolve(returnData);
                util.log.recordLog(logger, {
                    req,
                    res,
                    url,
                    name: 'RES',
                    category: 'SUCCESS',
                    content: param,
                    other: `|${JSON.stringify(returnData)}`
                });
            });
        });

    }
}