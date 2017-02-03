import Koa from 'koa'
const app = new Koa()
import request from './request';
// response //用户信息存入cookie
app.use(async (ctx) => {
  var res = await request();
  ctx.body = res;
})

app.listen(3000, () => console.log('server started 3000'))

export default app
