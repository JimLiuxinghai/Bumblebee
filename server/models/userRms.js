import { userRms, userRmsAccount } from './index.js';
let moment = require('moment');

export default {
    /**
     * 通过userid查找rms表中的数据
     * @param ctx
     * @param config
     * @returns {Promise.<*>}
     */
    async select(ctx, config = {}){
        let totalSql = `select guid, userid, login_email, active from rms_user where userid IN (?)`;
        return await userRmsAccount(ctx, totalSql, [config]);
    },

    /**
     * rms_user表插入数据
     * @param ctx
     * @param config
     * @returns {Promise.<*>}
     */
    async insert(ctx, config = {}){
        let param = {
            userid:config.userid,
            login_email:config.login_email,
            passwdwithsalt:config.passwdwithsalt,
            passwd:config.passwd,
            salt:config.salt,
            htl_cd:config.htl_cd,
            active:config.active,
            username:config.username
        };
        let fields = Object.keys(param);
        let data = [];
        fields.forEach((key)=>{
            data.push(param[key])
        });

        fields = fields.join(',');
        let totalSql = `INSERT INTO rms_user (${fields}) values (?)`;
        return await userRmsAccount(ctx, totalSql, [data]);
    },
    /**
     * map表插入数据
     * @param ctx
     * @param config
     * @returns {Promise.<*>}
     */
    async insertHtlMap(ctx, config = {}){
        let data = [];
        let sql = [];
        if(config.userid) {
            sql.push(`userid = ?`);
            data.push(config.userid);
        }
        if(config.role_id) {
            sql.push(`role_id = ?`);
            data.push(config.role_id);
        }
        if(config.htl_cd) {
            sql.push(`htl_cd = ?`);
            data.push(config.htl_cd);
        }
        let totalSql = `INSERT INTO rms_hotel_mapuser (userid,role_id,htl_cd) values (?)`;
        return await userRmsAccount(ctx, totalSql, [data]);

    },
    async update(ctx, config = {}){
        let sql = [];
        let data = [];
        sql.push(`active = ?`);
        data.push(config.active);
        data.push(config.userid);
        return await userRmsAccount(ctx, `update rms_user set ${sql} where userid = ?`, data);
    },


    async selectHolidays(ctx, config = {}){
        let totalSql = `select id, holiday_type as type, descp as name, descp_en as name_en, start_time, end_time, comments from rms_ref_holidays where htl_cd = 0`;
        return await userRms(ctx, totalSql, []);
    },

    async insertHolidays(ctx, config = {}){
        let totalSql = `INSERT INTO rms_ref_holidays (htl_cd, holiday_type, source, descp, descp_en, start_time, end_time, comments, holiday_status, holiday_level) values (?)`;
        return await userRms(ctx, totalSql, [['0', config.type, 1, config.name, '', config.start_time, config.end_time, '', 0, 0]]);
    }
}