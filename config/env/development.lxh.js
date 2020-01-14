module.exports = {
	port: 3001,
	api: {
		test: {
			user: {
				url: 'https://dv-ucenter.com'
			}
		}
	},
	db: {
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