/* eslint-disable no-console */
const koa = require('koa');
const fs = require('fs');
const koaRoute = require('koa-router');
const path = require('path');
const glob = require('glob');
const middleware = require('./middlewares');

class BumblebeeLoader {
    loader(path) {
        const dir = fs.readdirSync(path);
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
        //注册中间件
        middleware(this);
        //全局添加配置文件
        global.ENV_CONFIG = require(`../config/env/${this.env}`);
    }

    setRouters() {
        //注册api路由
        const _setRouters = (app) => {
            const dir = 'api';
            const routersDir = path.join(__dirname, dir);
            
            //加载service
            const svs = {};
            app.loader.loadService().forEach((service) => {
                svs[service.name] = service.module;
            });
            glob.sync(routersDir + '/**/*.js').forEach((file) => {
                let routers = require(file)(app);
                let dirname = path.dirname(file).split(path.sep);
                dirname = dirname.pop();
                let name = path.basename(file, '.js');
                let rPath = `/${dir}/${dirname}/${name}`;
                
                Object.keys(routers).forEach((key) => {
                    const [method] = key.split(' ');
                    app.router[method](rPath, (ctx) => {
                        const handler = routers[key];
                        //挂载service
                        handler(ctx, svs);
                    });
                });
            });
            
            return app.router.routes();
        };
        this.use(_setRouters(this));
        
    }
}

module.exports = BumBleBee;