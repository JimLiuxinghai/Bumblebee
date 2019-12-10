var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'info';

module.exports = {
    getUser(ctx) {
        logger.info("Some debug messages");
        ctx.body = 'getuser';
        
    },
    getUserInfo(ctx) {
        ctx.body = 'getUserInfo';
    }
};