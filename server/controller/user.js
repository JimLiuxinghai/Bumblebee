const userModel = require('../bs_models/user');
module.exports = {
    async getUser(ctx, svs) {

        let params = {
            url: '/api/v1/user/info',
            data: {}
        };
        try {
            //let reqData = await svs.user.userInfo(ctx, params);
            let data = await userModel.select(ctx, { userid: 300000})
            ctx.send({ data: data });
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