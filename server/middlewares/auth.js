/**
 * Api权限校验中间件
 * 
 */

function log( ctx ) {
    let session = ctx.session;
    console.log(session, '***')
}

module.exports = async (ctx, next) => {
    // log(ctx);
    return next()
};