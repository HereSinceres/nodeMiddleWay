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
