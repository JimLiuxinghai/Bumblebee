/**
 * get user
 */
module.exports = (app) => {
    return {
        'get /': app.controller.user.getUser
    };
};