const Redis = require('ioredis');
const maxage = 1000 * 60 * 60 * 2; //两个小时
module.exports = {
    port: 3001,
    secretKey: 'your session key', //your session key
    domain: '.example.com', //your site  
    api: {
        test: {
            user: {
                url: 'https://dv-ucenter.com'
            }
        }
    },

    db: {
        //session store or you can use  RedisCluster  
        store: new Redis({
            port: 6379, // Redis port
            host: "127.0.0.1", // Redis host
            family: 4, // 4 (IPv4) or 6 (IPv6)
            password: "auth",
            db: 0
        }),
        config: {

        }
    },
    logger: {
        name: 'prd',
        level: 'info',
        json: true,
        colorize: false,
        localTime: true,
        datePattern: 'YYYYMMDD',
        filename: 'access.log.%DATE%',
        dirname: `./logs`
    }
};