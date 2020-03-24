const maxage = 1000 * 60 * 60 * 24 * 30; //一个月
module.exports = {
	port: 3001,
	sessionKey: '_S',
	secretKey: 'Bumblebee', //session key
	domain: '.demo.com',
	api: {
		user: {
			url: 'http://lxh-ucenter.brandwisdom.cn/api/v1'
		}
	},
	db: {
		//session store
		redis: {
			isRedisCluster: true,
			nodes: [
				{ host: '10.204.4.1', port: 6387 },
				{ host: '10.204.4.2', port: 6387 },

				{ host: '10.204.4.2', port: 6388 },
				{ host: '10.204.4.3', port: 6386 },

				{ host: '10.204.4.3', port: 6387 },
				{ host: '10.204.4.1', port: 6388 }
			],
			clusterOptions: {
				keyPrefix: '{s}:',
				redisOptions: {
					password: "4lUdIsyC8jRAl8D",
					ttl: maxage
				}
			}
		},
		mysql: {
			host: '10.204.13.156',
			port: 3306,
			username: 'wisdom',
			password: '13JWpgaPal9N1ebE',
			database: 'ucenter',
			comments: 'ucenter'
		},
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