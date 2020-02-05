const request = require('request');
const tips = require('./lib/tips');
const log = require('./lib/log');
/**
 * request()(req, {}).then();
 *
 * 后端接口
 *
 * @returns {Function}
 */
module.exports = (ctx) => {
    return (options) => {
        let ip = util.operate.realIp(ctx);

        // data
        options.data = options.data || {};

        const method = (options.type || 'POST').toUpperCase();

        let apiConfig = ENV_CONFIG.api[options.api];

        options.headers = util.object.extend(options.headers || {}, apiConfig.data || {});

        let url = (apiConfig.url || '') + options.url;

        // 设置cookie
        let token = options.token || '';
        let j = request.jar();
        if (token) {
            let cookie = request.cookie('token=' + token);
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


        if (options.timeout) {
            param.timeout = options.timeout * 1000;
        }

        // get请求时，走querystring
        if (method === 'GET') {
            param.qs = options.data;
            token && (param.qs.token = token);
        } else {
            if (options.isBodyData) {
                param.json = options.data;
                param.json.token = token;
            } else {
                param.form = options.data;
                if (token) {
                    param.form.token = token;
                }
            }

        }

        // header
        param.headers = {
            'client-ip': ip,
            'User-Agent': ctx.header['user-agent'],
            'token': token
        };
        param.headers = util.object.extend(param.headers, options.headers || {});
        // 记录传入的参数
        log.info({ TYPE: '[REQUEST ACCESS]', traceId: ctx.traceId, ip, method: ctx.request.method, url: param.uri, query: ctx.query || ctx.request.body, status: ctx.response.status, qs: param.qs });
        // util.log.recordLog(logger, {
        //     req,
        //     res,
        //     url,
        //     name: 'REQ',
        //     category: 'OPTIONS',
        //     content: param
        // });
        return new Promise((resolve, reject) => {

            request(param, (err, request, body) => {
                // 错误记录
                if (err) {
                    reject(tips['ERR_SYSTEM_ERROR']);
                    log.error({ TYPE: '[REQUEST ERROR]', traceId: ctx.traceId, ip, method: param.method, url: param.uri, error: err.messages });
                    return;
                }

                let data = body;
                // 兼容2套不同的api
                let returnData = {};
                try {
                    data = typeof data === 'string' ? JSON.parse(data) : data;
                } catch (err) {
                    reject(tips['ERR_SYSTEM_ERROR']);
                    data = null;
                    log.error({ TYPE: '[REQUEST ERROR]', traceId: ctx.traceId, ip, method: param.method, url: param.uri, qs: param.qs, error: err.message });
                    return;
                }
                if (typeof data.data === 'string') {
                    returnData = data.data || {};
                } else {
                    returnData = data.data || data.dataInfo || data.result || {};
                }
                console.log(returnData, 'data')
                resolve(returnData);
                log.info({ TYPE: '[REQUEST SUCCESS]', traceId: ctx.traceId, ip, method: param.method, url: param.uri, qs: param.qs, data: returnData });
            });
        });

    }
}