const mysql = require('mysql');
const log4js = require('log4js');
const sqlLog = log4js.getLogger('[SQL]');

const accountConfig = ENV_CONFIG.db.account;
const rmsacConfig = ENV_CONFIG.db.rmsaccount;
const rmsConfig = ENV_CONFIG.db.rmsconfig;
// const biacConfig = ENV_CONFIG.db.biaccount;
//todo
// const rmsProductConfig = ENV_CONFIG.db.rmsProduct;

/**
 * 创建连接池
 */
function createPool(config){
  //config.debug = true;
  return mysql.createPool(config);
}

/**
 * 格式化sql
 * @param sql
 * @returns {*}
 */
function formatSql(sql) {
  return sql.replace(/\s{2,}/g, ' ')
}
/**
 * 获取日志相关参数
 * @param req
 * @param sql
 * @param config
 * @returns {{ip: *, sqlKey: *, url: *}}
 */
function getUUID(req, sql, config = {}) {
  let ip = util.operate.clientIp(req);
  let key = util.operate.createRequestUid(req);
  let sqlKey = util.encrypt.md5(key + sql + JSON.stringify(config.data) + (new Date().getTime()));
  sqlKey = sqlKey.substring(sqlKey.length - 12, sqlKey.length);
  let transactionId = null;
  if (config.isTransaction) {
    transactionId = util.encrypt.md5(key + sql + 'transactionId' + (new Date().getTime()))
  }
  return {
    ip: ip,
    key,
    sql,
    sqlKey: sqlKey,
    url: req.url,
    transactionId: transactionId
  }
}
/**
 * 记录日志
 * @param uuid 日志的参数（唯一）
 * @param setting
 */
function logForSql(uuid, setting = {}) {
  let query = setting.query || {};
  let arg = [`[${uuid.comments}]`, `[${uuid.key}]`, `[${uuid.ip}]`, `[${uuid.sqlKey}]`, `[${setting.type}]`, `[${uuid.url}]`];

  if (uuid.transactionId) {
    arg.push(` TRANID [${uuid.transactionId}] `);
  }
  if (Array.isArray(query)) {
    query.forEach((q, i) => {
      arg.push(`###_${i}  ${q.sql}`);
    });
  } else {
    let sql = query.sql || uuid.sql;
    arg.push(`### ${sql}`);
  }
  if (setting.data) {
    arg.push(`### ${setting.data}`);
  }
  // sqlLog.info(...arg);
  console.log(...arg);
}

/**
 * 连接并且执行sql，返回一个promise
 * @param sql
 * @param config
 * @param connectionConfig
 * @returns {Promise}
 */
function query(req, sql, config, connectionConfig) {

  const UUID = getUUID(req, sql, {data: config});
  UUID.comments = connectionConfig.comments;
  sql = formatSql(sql);
  console.log()
  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection(connectionConfig);
    connection.connect();
    let query;
    query = connection.query(sql, config, function (err, rows, fields) {
      console.log(query.sql)
      if (err) {
        logForSql(UUID, {type: 'ERROR', data: err, query});
        reject(err);
        return
      }
      let result = JSON.stringify(rows);
      logForSql(UUID, {type: 'SUCCESS', data: result, query});
      resolve(JSON.parse(result), fields);
    });
    logForSql(UUID, {type: 'OPTION', data: false, query});

    connection.end();
  })
}


function queryPool (req, sql, config = {}, pool) {
  const UUID = getUUID(req, sql, {data: config});
  UUID.comments = 'testAccount';
  sql = formatSql(sql);
  return new Promise((resolve, reject) => {
    let query;
    pool.getConnection(function(err,conn){
      if(err) {
        logForSql(UUID, {type: 'ERROR', data: err, query});
        reject(err);
      } else {
        query = conn.query(sql, config, function (err, rows, fields) {
          if (err) {
            logForSql(UUID, {type: 'ERROR', data: err, query});
            reject(err);
            return
          }
          let result = JSON.stringify(rows);
          logForSql(UUID, {type: 'SUCCESS', data: result, query});
          conn.release();
          resolve(JSON.parse(result), fields);
        });

        logForSql(UUID, {type: 'OPTION', data: false, query});

      }
    });
  });

};
/**
 * 事物处理
 * @param req
 * @param sqls
 * @param connectionConfig
 * @returns {Promise}
 */
function queryTransaction(req, sqls, connectionConfig) {
  const UUID = getUUID(req, sqls, {isTransaction: true});
  UUID.comments = connectionConfig.comments;

  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection(connectionConfig);
    connection.connect();

    connection.beginTransaction(function (err) {
      if (err) {
        logForSql(UUID, {type: 'ERROR_beginTransaction', data: err});
        reject(err);
        return;
      }
      let query;

      // 回滚
      function rollback(err) {
        return connection.rollback(function () {
          logForSql(UUID, {type: 'ERROR', data: err, query});
          reject(err);
        });
      }

      function commint(query, rows) {
        return connection.commit(function (err) {
          if (err) {
            return rollback(err);
          }
          let result = JSON.stringify(rows);
          logForSql(UUID, {type: 'SUCCESS', data: result, query});
          resolve(JSON.parse(result));
          connection.end();
        });
      }

      /**
       * 轮询
       */
      function selectQuery() {
        const sqlConfig = sqls.shift();
        let sqlStr = formatSql(sqlConfig.sql);
        query = connection.query(sqlStr, sqlConfig.data, function (err, rows, fields) {
          if (err) {
            // 事物回滚
            return rollback(err);
          }
          logForSql(UUID, {type: 'SUCCESS', data: false, query});
          if (!sqls.length) {
            return commint(query, rows);
          }
          selectQuery()
        });
        logForSql(UUID, {type: 'SUCCESS', data: false, query});
      }

      selectQuery();
    });
  })
}

function querySql(req, sql, config, connConfig) {
  if (config.isTransaction) {
    return queryTransaction(req, sql, connConfig)
  }
  return query(req, sql, config || [], connConfig);
}
const accountPool = createPool(accountConfig);
const rmsacPool = createPool(rmsacConfig);
const rmsPool = createPool(rmsConfig);
// const biacPool = createPool(biacConfig);

//todo rms线上库查询
// const rmsProductPool = createPool(rmsProductConfig);

/**
 * query查询
 * @param ctx       请求体
 * @param sql       sql字符串
 * @param config    配置
 * @returns {*}
 */
exports.accountQuery = (ctx, sql, config = {})=> {
  return queryPool(ctx.req, sql, config, accountPool);
};
/**
 * bi用户信息
 * @param ctx
 * @param sql
 * @param config
 * @returns {Promise<T>}
 */
// exports.userBi = (ctx, sql, config = {})=> {
//   return queryPool(ctx.req, sql, config, biacPool);
// };

/**
 * rms
 * @param ctx       请求体
 * @param sql       sql字符串
 * @param config    配置
 * @returns {*}
 */
exports.userRmsAccount = (ctx, sql, config = {})=> {
  return queryPool(ctx.req, sql, config, rmsacPool);
};
/**
 * rms用户信息
 * @param req       请求体
 * @param sql       sql字符串
 * @param config    配置
 * @returns {*}
 */
exports.userRms = (ctx, sql, config = {})=> {
  return queryPool(ctx.req, sql, config, rmsPool);
};

// exports.rmsProduct = (ctx, sql, config = {})=> {
//   return queryPool(ctx.req, sql, config, rmsProductPool);
// };