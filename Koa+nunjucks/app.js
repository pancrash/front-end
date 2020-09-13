const Koa = require('koa');
const staticCache = require('koa-static-cache');
const KoaRouter = require('@koa/router');
const KoaBody = require('koa-body');
const nunjucks = require('nunjucks');
const mysql = require('mysql2');

// 创建一个mysql的链接对象
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'burke189',
    database: 'kkb_shop'
});

function query(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, function(err, results) {
            if (err) {
                reject(err);
            } else{
                resolve(results);
            }
        });
    })
}

// const categories = require('./data/categories.json');
// const items = require('./data/items.json');

const tpl = new nunjucks.Environment(
    new nunjucks.FileSystemLoader('./template'),
    {
        watch: true,
        noCache: true
    }
);

const app = new Koa();

// 静态
app.use( staticCache({
    prefix: '/public',
    dir: __dirname + '/public',
    gzip: true,
    dynamic: true
}) );

// 通过 router 对象来管理url与函数的对应关系
const router = new KoaRouter();

router.get('/:categoryId(\\d*)', async ctx => {
    // console.log(ctx.query);

    let categoryId = Number(ctx.params.categoryId);
    let page = Number(ctx.query.page) || 1;
    // console.log(page)

    // let result1 = await query(
    //     "select * from categories"
    // );
    // console.log('result1', result1);

    // let categories = [];
    let categories = await query(
        "select * from categories"
    );

    // let items = [];
    let where = '';
    if (categoryId) {
        where = `where category_id=${categoryId}`
    }

    // 计算页

    // 每页显示条数
    let prepage = 8;
    let start = (page-1) * prepage;  //1=>0,2=>8
    // console.log(prepage, start)
    let [{count}] = await query(
        `select count(id) as count from items ${where}`
    );
    let pages = Math.ceil(count / prepage);
    // console.log(count, prepage)
    // console.log('count', count);

    page = Math.max(page, 1);
    page = Math.min(page, pages);

    let items = await query(
        `select * from items ${where} order by id desc limit ?, ?`,
        [
            start,
            prepage
        ]
    );

    ctx.body = tpl.render('index.html', {
        categories,
        items,
        count,
        pages,
        page
    })
});
router.get('/register', async ctx => {
    ctx.body = tpl.render('register.html');
})
router.get('/addItem', async ctx => {
    let categories = await query(
        "select * from categories"
    );

    ctx.body = tpl.render('addItem.html', {
        categories
    });
})
router.post('/register', KoaBody(), async ctx => {
    let {username, password} = ctx.request.body;
    if (!username || !password) {
        return ctx.body = '注册失败';
    }
    let rs = await query(
        "insert into `users` (`username`, `password`) values (?, ?)",
        [username, password]
    )
    ctx.body = '注册成功';
});
router.post('/addItem', KoaBody(), async ctx => {
    let {name, price, categoryId} = ctx.request.body;
    if (!name || !price) {
        return ctx.body = '参数错误';
    }
    let rs = await query(
        "insert into `items` (`category_id`, `name`, `price`) values (?, ?, ?)",
        [categoryId, name, price]
    )
    ctx.body = '添加成功';  // ctx.body => ctx.response.body
});

router.get('/register', async ctx => {
    ctx.body = tpl.render('register.html');
});

router.get('/login', async ctx => {
    ctx.body = tpl.render('login.html');
});

app.use( router.routes() );



app.listen(8888);