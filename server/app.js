/* eslint-disable no-undef */
/* eslint-disable no-console */

const BumBleBee = require('./core');
const app = new BumBleBee();

const middleware = require('./middlewares');


// app.getLog();

app.setRouters();

app.listen(ENV_CONFIG.port, () => {
    console.log(`服务器启动:${ENV_CONFIG.port}`);
});