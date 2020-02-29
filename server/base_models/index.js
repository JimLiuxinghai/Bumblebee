const mysql = require('mysql');

/**
 * 格式化sql
 * @param sql
 * @returns {*}
 */
function formatSql(sql) {
    return sql.replace(/\s{2,}/g, ' ')
}
/**
 * 创建连接池
 */
exports.createPool = (config) => {
    //config.debug = true;
    return mysql.createPool(config);
}

/**
 * 连接并且执行sql，返回一个promise
 * @param sql
 * @param config
 * @param connectionConfig
 * @returns {Promise}
 */
exports.query = (ctx, sql, config, connectionConfig) => {

    sql = formatSql(sql);
    return new Promise((resolve, reject) => {
        let connection = mysql.createConnection(connectionConfig);
        connection.connect();
        let query;
        query = connection.query(sql, config, function (err, rows, fields) {
            if (err) {
                util.log.error({ TYPE: '[SQL ERROR]', traceId: ctx.traceId, error: err, query });
                // logForSql(UUID, { type: 'ERROR', data: err, query });
                reject(err);
                return
            }
            let result = JSON.stringify(rows);
            
            util.log.info({ TYPE: '[SQL SUCCESS]', traceId: ctx.traceId, data: result, query });
            
            resolve(JSON.parse(result), fields);
        });
        
        connection.end();
    })
}

/**
 * 连接池查询
 * @param {}} ctx 
 * @param {*} sql 
 * @param {*} config 
 * @param {*} pool 
 */

exports.queryPool = (ctx, sql, config = {}, pool) => {
    
    sql = formatSql(sql);
    return new Promise((resolve, reject) => {
        let query;
        pool.getConnection(function (err, conn) {
            if (err) {
                util.log.error({ TYPE: '[SQL ERROR]', traceId: ctx.traceId, error: err, query });
                reject(err);
            } else {
                query = conn.query(sql, config, function (err, rows, fields) {
                    if (err) {
                        util.log.error({ TYPE: '[SQL ERROR]', traceId: ctx.traceId, sql, error: err  });
                        reject(err);
                        return
                    }
                    let result = JSON.stringify(rows);
                    
                    util.log.info({ TYPE: '[SQL SUCCESS]', traceId: ctx.traceId, sql, data: rows });
                    conn.release();
                    resolve(JSON.parse(result), fields);
                });

            }
        });
    });

};