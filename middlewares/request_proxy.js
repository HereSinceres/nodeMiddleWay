
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