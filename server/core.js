/* eslint-disable no-console */
const koa = require('koa');
const fs = require('fs');
const koaRoute = require('koa-router');
const path = require('path');
const beelog = require('./log');

class BumblebeeLoader {
    loader(path) {
        const dir = fs.readdirSync(path);//同步方法无所谓的，因为是在服务器跑起来之前就完成映射，不会有任何性能影响
        return dir.map((filename) => {
            const module = require(path + '/' + filename);
            return { name: filename.split('.')[0], module };
        });
    }
    //加载controller
    loadController() {
        const url = path.join(__dirname, './controller');
        
        return this.loader(url);
    }
    //加载serverice
    loadService() {
        const url = path.join(__dirname, './service');

        return this.loader(url);
    }

}

class BumBleBee extends koa {
    constructor() {
        super();
        this.router = new koaRoute();
        
        this.loader = new BumblebeeLoader();
        const controllers = this.loader.loadController();
        this.controller = {};

        controllers.forEach((crl) => {
            this.controller[crl.name] = crl.module;
        });
                
        global.ENV_CONFIG = require(`../config/env/${this.env}`);
    }

    setRouters() {
        const _setRouters = (app) => {
            const routers = require('./api')(app);
            const svs = {};
            app.loader.loadService().forEach((service) => {
                svs[service.name] = service.module;
            });
            Object.keys(routers).forEach((key) => {
                const [method, path] = key.split(' ');
                app.router[method](path, (ctx) => {
                    const handler = routers[key];
                    handler(ctx, svs);
                });
            });
            return app.router.routes();
        };
        this.use(_setRouters(this));
        
    }
    getLog () {
        this.use(beelog({
            env: this.env,
            projectName: 'BumBleBee',
            appLogLevel: 'debug',
            dir: '../logs'
        }));
    }
}

module.exports = BumBleBee;