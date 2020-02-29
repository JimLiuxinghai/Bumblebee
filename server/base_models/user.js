const baseModel = require('./index');

const userSqlConfig = ENV_CONFIG.db.mysql; //配置文件中 db配置

const userPool = baseModel.createPool({
    host: userSqlConfig.host,
    user: userSqlConfig.username,
    password: userSqlConfig.password,
    database: userSqlConfig.database,
    port: userSqlConfig.port,
    dateStrings: 'DATE'
});
exports.query = (ctx, sql, config = {}) => {
    return baseModel.queryPool(ctx, sql, config, userPool);
};