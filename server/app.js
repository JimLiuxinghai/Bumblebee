
const BumBleBee = require('./core');
const app = new BumBleBee();



app.getLog();

//先引入中间件再注册路由
app.useMiddleware();

app.setRouters();



app.listen(ENV_CONFIG.port, () => {
    console.log(`服务器启动:${ENV_CONFIG.port}`);
})