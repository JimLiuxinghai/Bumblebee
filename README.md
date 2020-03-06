# Bumblebee

> 企业级Node API 服务脚手架

## 功能列表

* 环境区分
* 多人协同
* 路由自动化
* 业务分层
* ORM
* 日志系统（链路跟踪）
* 进程守护

## 如何使用

1.fork项目 并clone到本地

2.

## 项目预览
```
  '    |-- app.js',
  '    |-- package.json',
  '    |-- yarn.lock',
  '    |-- config',
  '    |   |-- env',           ──────>环境配置信息
  '    |   |   |-- development.js',
  '    |   |   |-- development.lxh.js',
  '    |   |   |-- production.js',
  '    |   |   |-- test.js',
  '    |   |-- ngx',           ──────>nginx配置
  '    |   |   |-- demo.conf',
  '    |   |   |-- development.demo.conf',
  '    |   |   |-- production.demo.conf',
  '    |   |   |-- test.demo.conf',
  '    |   |-- pm2',           ──────>pm2 启动配置
  '    |       |-- lxh.json',
  '    |       |-- lxh.local.json',
  '    |       |-- prod.json',
  '    |       |-- test.json',
  '    |-- logs',
  '    |   |-- .gitignore',
  '    |-- server',
  '        |-- app.js',
  '        |-- core.js',
  '        |-- api',
  '        |   |-- v1',
  '        |       |-- user.js',
  '        |-- base_models',
  '        |   |-- index.js',
  '        |   |-- user.js',
  '        |-- bs_models',
  '        |   |-- user.js',
  '        |-- controller',
  '        |   |-- user.js',
  '        |-- middlewares', ──────>中间件集合
  '        |   |-- auth.js', ──────>网关校验
  '        |   |-- index.js', 
  '        |   |-- log.js',  ──────>日志
  '        |   |-- send.js', ──────>
  '        |   |-- session.js', ──────>
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