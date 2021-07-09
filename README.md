初衷：我并不想改变团队原有开发模式，前端负责展现和界面路由，后端单纯负责API;

要解决的问题：Cancel changes

1.服务端渲染（部分界面【商品界面】需要使用服务器端渲染，但是管理类型界面并不需要服务器端渲染）；

2.由于问题1的出现，所以我们需要服务器端渲染，需要控制路由，需要部分界面使用后端模板引擎。

3.当然我不想写两套api请求方式，Node.js可以搞定使用一套方案；

4.后台服务请求当然走代理服务。

方案选择：

1.koa2基础框架

2.axios--api请求服务

3.http-proxy--代理转发

其余日志处理，路由，后端模板引擎，异步语法自己选择了。
具体实现【仅供参考】：

1.代理转发【写koa2中间件】：匹配请求路由代理转发目标服务器
```
//中间件request_proxy.js
var httpProxy = require('http-proxy'); 
//EG:http://localhost:3001/rs-server-api/v1/goods/list
var proxy = new httpProxy.createProxyServer({
    target: 'https://stage.recovery-server.jiahuyunyi.com/',
    changeOrigin: true              // for vhosted sites, changes host header to match to target's host
});
var response_formatter = (ctx) => {
    proxy.web(ctx.req, ctx.res);
    ctx.body = ctx.res;
} 
var url_filter = (pattern) => {
    return async (ctx, next) => {
        var reg = new RegExp(pattern);
        try {
            //通过正则的url进行格式化处理
            if (reg.test(ctx.originalUrl)) {
                response_formatter(ctx);
            }
            await next();
        } catch (error) { 
            //继续抛，让外层中间件处理日志
            throw error;
        } 
    }
}
module.exports = url_filter;
```
```app.js  
const request_proxy = require('./middlewares/request_proxy');
//匹配路由/rs-server-api/v1/
app.use(request_proxy('^/rs-server-api/v1/'));
```

2.后端服务：当然ajax请求也是用这个js

```services/index.js
import axios from "axios";
//没有权限直接跳转到登录界面
function fetchGoodsList() {
    return axios.get('http://localhost:3001/rs-server-api/v1/goods/list');
}
export default {
    fetchGoodsList: fetchGoodsList
}
```
在controller中调用服务
```
var router = require('koa-router')();
var Service = require('../services/index.js');
router.get('/', async function (ctx, next) {
  ctx.state = {
    title: await Service.fetchGoodsList().then((response) => {
      return JSON.stringify(response.data);
    })
  };
  await ctx.render('index', {
  });
})
module.exports = router;

```

最后项目DEMO地址，基于很多位前辈代码，仅仅加入代理转发
https://github.com/HereSinceres/nodeMiddleWay

# koa2-boilerplate

A minimal boilerplate of [koa v2](https://github.com/koajs/koa/issues/533).

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## Installation

Both ways you can start:

    fork this repo & git clone the repo
    npm install koa2-boilerplate


## Command

#### Setup

    npm install

#### Develop

    npm start

#### Test

    npm test



## Dependencies

- Watcher and hot-reload: [nodemon](http://nodemon.io/)
- Test:
    + [mocha](https://mochajs.org/)
    + [should](https://github.com/shouldjs/should.js)
    + [supertest](https://github.com/visionmedia/supertest)
- Build: [babel](http://babeljs.io/)
    + tools: babel-register
    + presets: babel-preset-es2015-node5
    + plugins: transform-async-to-generator, syntax-async-functions
- *Lint*:
    You can choose the lint tool that you prefer.

## Reference

- [koajs/koa#533](https://github.com/koajs/koa/issues/533)
- [koajs/koa#596](https://github.com/koajs/koa/issues/596)


## License

MIT &copy; [GeekPlux](https://github.com/geekplux)



[npm-image]: https://img.shields.io/npm/v/koa2-boilerplate.svg
[npm-url]: https://npmjs.org/package/koa2-boilerplate
[downloads-image]: https://img.shields.io/npm/dm/koa2-boilerplate.svg
[downloads-url]: https://npmjs.org/package/koa2-boilerplate






<!--#####TODOLIST
1.路由
2.代理
3.目录结构
#####TODOLIST-->

登录信息存储在cookie（页面使用）

接口调用都加入head中

页面调用服务接口  从cookie取信息

Node调用服务接口 从cookie取信息
