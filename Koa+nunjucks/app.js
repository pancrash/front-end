const Koa = require('koa');
const staticCache = require('koa-static-cache');
const KoaRouter = require('@koa/router');
const nunjucks = require('nunjucks');

const categories = require('./data/categories.json');
const items = require('./data/items.json');

const tpl = new nunjucks.Environment(
    new nunjucks.FileSystemLoader('./template'),
    {
        // 动态编译（模板只要变化重新编译）
        watch: true,
        // 每次都从硬盘中读取
        noCache: true
    }
);

const app = new Koa();

// 静态
app.use( staticCache({
    prefix: '/public',
    dir: __dirname + '/public',
    gzip: true,
    // 开发中使用，动态监控静态目录的文件变化
    dynamic: true
}) );

// 通过 router 对象来管理url与函数的对应关系
const router = new KoaRouter();

router.get('/', async ctx => {
    ctx.body = tpl.render('index.html', {
        categories,
        items
    })
});


router.get('/register', async ctx => {
    ctx.body = tpl.render('register.html');
});

router.get('/login', async ctx => {
    ctx.body = tpl.render('login.html');
});

app.use( router.routes() );



app.listen(8888);