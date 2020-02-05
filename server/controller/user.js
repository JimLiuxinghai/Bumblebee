const userModel = require('../models/user');
module.exports = {
    async getUser(ctx, svs) {

        let params = {
            url: '/api/v1/user/info',
            data: {}
        };
        try {
            let reqData = await svs.user.userInfo(ctx, params);
            ctx.send({ data: reqData });
        } catch (err) {
            ctx.sendError();
        }
        
    },
    getUserInfo(ctx) {
        ctx.session.name = 'jimliu';
        let data = {
            a: 'userinfo'
        };

        ctx.send({ data });
    }
};