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
        try {
            let data = await svs.user.userInfo(ctx, params);
            
            ctx.send({ data });
        }
        catch (err) {
            ctx.sendError();
        }
    }
};