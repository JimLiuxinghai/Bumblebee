const Redis = require('ioredis');
const maxage = 1000 * 60 * 60 * 2; //2 hours
module.exports = {
    port: 3003,
    sessionKey: "your session key",
    secretKey: 'your session secret', //your session secret
    domain: '.example.com', //your site  
    api: {
        test: {
            user: {
                url: 'https://demo.com' //http address
            }
        }
    },

    db: {
        //session store or you can use  RedisCluster  
        redis: {
            port: 6379, // Redis port
            host: "127.0.0.1", // Redis host
            family: 4, // 4 (IPv4) or 6 (IPv6)
            password: "auth",
            db: 0
        },
        mysql: {
            host: '127.0.0.1',
            port: 3306,
            username: 'username',
            password: '123456',
            database: 'your database',
            comments: 'your commnets'
        },
    },
    logger: {
        name: 'your logger names',
        level: 'info',
        json: true,
        colorize: false,
        localTime: true,
        datePattern: 'YYYYMMDD',
        filename: 'access.log.%DATE%',
        dirname: `./logs`
    }
};