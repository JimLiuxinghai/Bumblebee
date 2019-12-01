const BumBleBee = require('./core');
const app = new BumBleBee();
app.setRouters();

app.listen(ENV_CONFIG.port, () => {
    console.log(`服务器启动:${ENV_CONFIG.port}`);
})