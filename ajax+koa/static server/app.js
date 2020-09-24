const Koa = require('koa');
const KoaStaticCache = require('koa-static-cache');
const koaServerHttpProxy = require('koa-server-http-proxy');

const app = new Koa();

app.use(koaServerHttpProxy('/api', {
    target: 'http://localhost:8888',
    pathRewrite: {
        '^/api': ''
    }
    // http://localhost:8888/getUsers
}))

app.use(KoaStaticCache({
    prefix: '/',
    dir: __dirname + '/static',
    gzip: true,
    dynamic: true
}));


app.listen(9999);
