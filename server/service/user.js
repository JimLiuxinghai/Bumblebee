const userModel = require('../bs_models/user');
module.exports = {
    async userInfo(ctx) {
        let params = {
            url: '/api/v1/user/info',
            data: {}
        };
        return userModel.getUserInfo(ctx, params)
    }
};