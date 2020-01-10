/**
 * get user
 */
const auth = require('../../middlewares/auth');
module.exports = (app) => {
    app.use(auth)
    return {
        'get /': app.controller.user.getUser
    };
};