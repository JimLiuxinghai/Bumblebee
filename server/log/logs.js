const path = require('path');
const log4js = require('log4js');
const logDir = path.join(__dirname, '../logs')  //配置目标路径 logs
const config = require('./config');
const connect = require('./connect');
/*生成logs目录*/
 try {
    require('fs').mkdirSync(logDir)  //新建目录， ./logs
 } catch(err) {
    if(err.code !== 'EEXIST') {
        console.error('Could not set up log directory, error was: ', err)
        process.exit(1)
    }
 }
 //根据log 配置文件(log4js.json)配置日志文件

log4js.configure(config(logDir), { cwd: logDir })

// connect(log4js.getLogger('[HTTP_ACCESS]'), `[:remote-addr] -- :url|:req[cookies]|:referrer|:user-agent`)
//const logger = connect(log4js.getLogger('[HTTP_ACCESS]'), `[:remote-addr] -- :url|:req[cookies]|:referrer|:user-agent`)

// console.log(logger.info)
// //输入日志
// logger.info('logs config finished!')

/**
 * 默认会记录所有http请求
 */
exports.use = function use(){
    return connect(log4js.getLogger('[HTTP_ACCESS]'), `[:remote-addr] -- :url|:req[cookies]|:referrer|:user-agent`)
};

