# Bumblebee

> 企业级Node API 服务脚手架

搭配[Honeybee-cli](https://github.com/bikedawuwang/bee-cli)使用

## 功能列表

* 环境区分
* 多人协同
* 路由自动化
* 业务分层
* ORM
* 日志系统（链路跟踪）
* 进程守护

## 功能介绍

### 业务逻辑与控制流程分开

业务代码处理都在controller内

* 控制器主要用于控制流程，不出现任何业务具体实现代码
* 分散的业务代码，可以被很容易的复用，单元测试

### 业务逻辑分离，引入service

通用业务逻辑放入sevice

#

## 如何使用


### 1.fork项目 并clone到本地

### 2.添加相关配置文件

```
pm2
    your-name.json
env
    your-name.js  //配置项参考development.js
ngx
    your-name.conf //针对你域名的nginx配置 服务器中使用软链
```

### 3.增加接口

api/v1 内新增 user.js

```
const auth = require('../../middlewares/auth'); //权限控制中间件
module.exports = (app) => {
    app.use(auth) //接口权限控制 按需添加
    return {
        'get /': app.controller.user.getUser //controller
    };
};
```

controller 中新增user.js
```
const userModel = require('../bs_models/user');
module.exports = {
    //直接使用models示例
    async getUser(ctx) {
        try {
            
            let data = await userModel.select(ctx, { userid: 300000})
            ctx.send({ data: data });
        } catch (err) {
            ctx.sendError();
        }
        
    },

    //使用service示例
    async getUserInfo(ctx, svs) {
        try {
            let data = await svs.user.userInfo(ctx, params);
            //test session
            ctx.session.name = 'jimliu';
            
            ctx.send({ data });
        }
        catch (err) {
            ctx.sendError();
        }
    }
};
```

service 中添加user.js

```
const userModel = require('../models/user');
module.exports = {
    async userInfo(ctx) {
        let params = {
            url: '/api/v1/user/info',
            data: {}
        };
        return userModel.getUserInfo(ctx, params)
    }
};
```

### 4.数据源

* 1.base_models中增加sql
* 2.使用util.request 请求数据

#

## 结构预览
```
  '    |-- app.js',
  '    |-- package.json',
  '    |-- config',
  '    |   |-- env',           ──────>环境配置信息
  '    |   |   |-- development.js',
  '    |   |   |-- production.js',
  '    |   |   |-- test.js',
  '    |   |-- ngx',           ──────>nginx配置
  '    |   |   |-- development.demo.conf',
  '    |   |   |-- production.demo.conf',
  '    |   |   |-- test.demo.conf',
  '    |   |-- pm2',           ──────>pm2 启动配置
  '    |       |-- development.json',
  '    |       |-- prod.json',
  '    |       |-- test.json',
  '    |-- logs',               ──────>log文件存放地址
  '    |   |-- .gitignore',
  '    |-- server',
  '        |-- app.js',
  '        |-- core.js',
  '        |-- api',
  '        |   |-- v1',
  '        |       |-- user.js',
  '        |-- base_models',  ──────>数据库连接
  '        |   |-- index.js',
  '        |   |-- user.js',
  '        |-- bs_models',  ──────>业务基础sql
  '        |   |-- user.js',
  '        |-- controller',
  '        |   |-- user.js',
  '        |-- middlewares', ──────>中间件集合
  '        |   |-- auth.js', ──────>网关校验
  '        |   |-- index.js', 
  '        |   |-- log.js',  ──────>日志
  '        |   |-- send.js', ──────>返回数据统一处理
  '        |   |-- session.js', ──────>session
  '        |   |-- trace.js', ──────> 日志链路id
  '        |-- service',
  '        |   |-- user.js',
  '        |-- util',          ──────>工具函数库
  '            |-- index.js',   ──────>前端使用工具函数集合
  '            |-- request.js', ──────>HTTP请求方法
  '            |-- server.js',  ──────>服务端使用工具函数集合
  '            |-- lib',
  '                |-- array.js',
  '                |-- cookie.js',
  '                |-- date.js',
  '                |-- encrypt.js',
  '                |-- log.js',
  '                |-- number.js',
  '                |-- object.js',
  '                |-- operate.js',
  '                |-- tips.js',
```

#

## TODO

* 1.完整示例

* 2.增加react，前后端同构

* 3.英文说明

## 联系

### 使用时遇到问题

* 1.可以提Issue
* 2.[微博私信](https://weibo.com/jimliuxinghai/profile?rightmod=1&wvr=6&mod=personinfo)
* 3.Wechat Base64: bHhobHhoaHhs=
