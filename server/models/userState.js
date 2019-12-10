import { accountQuery } from './index.js';
import moment from 'moment'

export default {

    async selectAll(ctx, config = {}){
        let size = 10;
        let page = config.page -1 ;
        let limit = page * size;
        let data = [];
        let sql = [];
        if(config.user_name) {
            sql.push(`user_name = ?`);
            data.push(config.user_name);
        }
        if(config.login_email) {
            sql.push(`login_email = ?`);
            data.push(config.login_email);
        }
        sql = sql.join(' and ');
        sql = sql != '' ? `where ${sql}` : '';
        let limitSql = [];
        if(config.page) {
            limitSql.push(`limit ${limit},${size}`);
        }
        let totalSql = `select user_name, userid, login_email, passwdwithsalt, passwd, salt, htl_cd, start_time, end_time, status from rms_user ${sql} ${limitSql}`;

        return await accountQuery(ctx, totalSql, data);

    },

    async selectCount(ctx,config = {}) {
        let sql = [];
        let data = [];
        if(config.user_name) {
            sql.push(`user_name = ?`);
            data.push(config.user_name);
        }
        if(config.login_email) {
            sql.push(`login_email = ?`);
            data.push(config.login_email);
        }
        sql = sql.join(' and ');
        sql = sql != '' ? `where ${sql}` : '';
        return await accountQuery(ctx, `select count(*) as count from rms_user ${sql}`, data);
    },

    async update(ctx, config = {}){
        let sql = [];
        let data = [];
        sql.push(`start_time = ?`);
        data.push(config.start_time);

        sql.push(`end_time = ?`);
        data.push(config.end_time);

        if(config.end_time < moment().unix() || config.start_time > moment().unix()){
            sql.push(`status = ?`);
            data.push(0);
        } else {
            sql.push(`status = ?`);
            data.push(1);
        }
        data.push(config.userid);
        return await accountQuery(ctx, `update rms_user set ${sql} where userid = ?`, data);
    },

    async select (ctx,config = {}){
        let sql = [];
        let data = [];
        sql.push(`login_email = ?`);
        data.push(config.user);
        return await accountQuery(ctx, `select userid, login_email, passwdwithsalt, passwd,salt from rms_user where ${sql}`, data);
    },

    async insert (ctx, config = {}){
        let fields = Object.keys(config);
        let data = [];
        fields.forEach((key)=>{
            data.push(config[key])
        });

        fields = fields.join(',');
        let totalSql = `INSERT INTO rms_user (${fields}) values (?)`;
        return await accountQuery(ctx, totalSql, [data]);
    }
}



