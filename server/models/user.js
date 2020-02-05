
/**
 * 查询用户信息
 * @returns {*}
 */

exports.getUserInfo = function (ctx, config = {}) {
    return util.request(ctx)({
        api: 'user',
        type: 'get',
        url: '/user/info',
        isBody: true,
        token: config.token,
        data: {
            st: 12312312,
            fields: 'user_id,user_login,user_name,user_phone,user_attributes,user_sex,user_email,lang,user_position,user_department'
        }
    })
};