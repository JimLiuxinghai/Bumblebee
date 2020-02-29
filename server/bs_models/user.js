const userBase = require('../base_models/user');
module.exports = {
    /**
     * 查询用户信息
     * @param {*} ctx 
     * @param {*} config 
     */
    async select (ctx, config = {}) {
        let sql = [`select * from overview where userid = ?`];
        let data = [config.userid];
        if(config.htl_cd) {
            sql.push(`and htl_cd = ?`);
            data.push(config.htl_cd);
        }
        sql = sql.join(' ');
        return await userBase.query(ctx, sql, data);
    }
}
