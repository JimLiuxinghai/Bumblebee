let utilTips = require('../util/lib/tips.js');

const sendHandle = () => {
    // 处理请求成功方法
    const render = ctx => {
        /**
         * config: {
         *      data: [],
         *      type: '' //tips type
         * }
         */
        return (config = {}) => {
            config.data = config.data || [];
            config.type = config.type || 'OK';

            let tips = utilTips[config.type];
            
            ctx.set('Content-Type', 'application/json');
            tips.data = config.data;
            ctx.body = tips;
        }
    }

    // 处理请求失败方法
    const renderError = ctx => {
        return (config = {}) => {
            config.type = config.type || 'ERR_SYSTEM_ERROR';
            ctx.set('Content-Type', 'application/json');
            let tips = utilTips[config.type]
            ctx.body = tips
        }
    }

    return async (ctx, next) => {
        ctx.send = render(ctx);
        ctx.sendError = renderError(ctx);
        await next();
    }
}

module.exports = sendHandle;