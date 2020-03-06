const userModel = require('../bs_models/user');
module.exports = {
    async getUser(ctx) {
        try {
            
            let data = await userModel.select(ctx, { userid: 300000})
            ctx.send({ data: data });
        } catch (err) {
            ctx.sendError();
        }
        
    },
    async getUserInfo(ctx, svs) {
        let params = {
            url: '/api/v1/user/info',
            data: {}
        };
        try {
            let data = await svs.user.userInfo(ctx, params);
            //test session
            ctx.session.name = 'jimliu';
            
            ctx.send({ data });
        }
        catch (err) {
            ctx.sendError();
        }
    }
};