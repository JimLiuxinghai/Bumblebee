/**
 * get user
 */
const auth = require('../../middlewares/auth');
module.exports = (app) => {
    app.use(auth) //接口权限控制 按需添加
    return {
        'get /': app.controller.user.getUser,
        'get /info': app.controller.user.getUserInfo
    };
};