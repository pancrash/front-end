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

const router = new KoaRouter();

app.use( async (ctx, next) => {
    let id = ctx.cookies.get('id');
    let username = ctx.cookies.get('username');
    // console.log(id, username);
    ctx.state.user = {}
    if (id) {
        // ctx.state 存储用户自定义数据
        ctx.state.user = {
            id,
            username
        }
    }
    await next();
});

router.get('/:categoryId(\\d*)', async ctx => {

    let categoryId = Number(ctx.params.categoryId);
    let page = Number(ctx.query.page) || 1;

    let categories = await query(
        "select * from categories"
    );

    let where = '';
    if (categoryId) {
        where = `where category_id=${categoryId}`
    }

    // 计算页

    // 每页显示条数
    let prepage = 8;
    let start = (page-1) * prepage;  //1=>0,2=>8
    let [{count}] = await query(
        `select count(id) as count from items ${where}`
    );
    let pages = Math.ceil(count / prepage);

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
        page,
        user: ctx.state.user
    })
});

router.get('/addItem', async ctx => {

    if (!ctx.state.user.id) {
        return ctx.body = tpl.render('message.html', {
            message: '你无权访问，请先登录',
            url: '/login'
        });
    }

    let categories = await query(
        "select * from categories"
    );

    ctx.body = tpl.render('addItem.html', {
        categories,
        user: ctx.state.user
    });
})

const addItemKoaBodyOptions = {
    // 开启 multipart/form-data 的支持
    multipart: true,
    formidable: {
        uploadDir: __dirname + '/public/images/items',
        keepExtensions: true
    }
}
router.post('/addItem', KoaBody(addItemKoaBodyOptions), async ctx => {
    let {name, price, categoryId} = ctx.request.body;
    let {cover} = ctx.request.files;

    // console.log('cover', name, price, categoryId, cover);
    let filename = '';
    if (cover) {
        // 通过 cover.path 把上传后的文件名获取到
        // 通过正则替换，统一路径表示，比如把 windows 下的 \ 替换成 /
        let path = cover.path.replace(/\\/g, '/');
        // console.log(path)
        let lastIndex = path.lastIndexOf('/');
        filename = path.substring(lastIndex + 1);
        // console.log(filename)
    }

    if (!categoryId || !name || !price) {
        return ctx.body = tpl.render('message.html', {
            message: '参数错误',
            url: 'javascript:history.back();'
        })
    }

    let rs = await query(
        "insert into `items` (`category_id`, `name`, `price`, `cover`) values (?, ?, ?, ?)",
        [categoryId, name, price, filename]
    )

    ctx.body = tpl.render('message.html', {
        message: '添加成功',
        url: '/',
        user: ctx.state.user
    })
});

router.get('/register', async ctx => {
    ctx.body = tpl.render('register.html');
});
router.post('/register', KoaBody(), async ctx => {
    let {username, password, repassword} = ctx.request.body;

    if (!username || !password) {
        return ctx.body = tpl.render('message.html', {
            message: '参数错误',
            url: 'javascript:history.back();',
            user: ctx.state.user
        })
    }
    if (password !== repassword) {
        return ctx.body = tpl.render('message.html', {
            message: '两次输入密码不一致',
            url: 'javascript:history.back();',
            user: ctx.state.user
        })
    }

    let rs = await query(
        "insert into `users` (`username`, `password`) values (?, ?)",
        [username, password]
    )

    ctx.body = tpl.render('message.html', {
        message: '注册成功',
        url: '/login',
        user: ctx.state.user
    })
});


const uploadKoaBodyOptions = {
    // 开启 multipart/form-data 的支持
    multipart: true,
    formidable: {
        uploadDir: __dirname + '/attachments',
        keepExtensions: true
    }
}

router.get('/upload', async ctx => {
    if (!ctx.state.user.id) {
        return ctx.body = tpl.render('message.html', {
            message: '你无权访问，请先登录',
            url: '/login'
        });
    }
    ctx.body = tpl.render('upload.html', {
        user: ctx.state.user
    });
});

router.post('/upload', KoaBody(uploadKoaBodyOptions), async ctx => {
    let {file} = ctx.request.files;
    console.log(file)

    if (file.size) {
        // 通过 cover.path 把上传后的文件名获取到
        // 通过正则替换，统一路径表示，比如把 windows 下的 \ 替换成 /
        let path = file.path.replace(/\\/g, '/');
        // console.log(path)
        let lastIndex = path.lastIndexOf('/');
        filename = path.substring(lastIndex + 1);
        type = file.type;
        size = file.size;

        let rs = await query(
            "insert into `attachments` (`filename`, `type`, `size`) values (?, ?, ?)",
            [filename, type, size]
        )
        ctx.body = tpl.render('message.html', {
            message: '上传成功',
            url: '/',
            user: ctx.state.user
        })
    }
    else{
        ctx.body = tpl.render('message.html', {
            message: '上传失败，请重新上传',
            url: '/upload',
            user: ctx.state.user
        })
    }




});

router.get('/login', async ctx => {
    ctx.body = tpl.render('login.html');
});

router.post('/login', KoaBody(), async ctx => {
    let {username, password} = ctx.request.body;

    if (!username || !password) {
        return ctx.body = tpl.render('message.html', {
            message: '参数错误',
            url: 'javascript:history.back();',
            user: ctx.state.user
        })
    }

    let [user] = await query(
        "select * from `users` where username=? and password=?",
        [username, password]
    )

    if (!user) {
        return ctx.body = tpl.render('message.html', {
            message: '用户名或密码错误',
            url: 'javascript:history.back();',
            user: ctx.state.user
        })
    }


    // ctx.res.setHeader('Set-Cookie', ['id='+user.id, 'username='+user.username]);
    ctx.cookies.set('id', user.id);
    ctx.cookies.set('username', user.username);

    return ctx.body = tpl.render('message.html', {
        message: '登录成功',
        url: '/',
        user: ctx.state.user
    })
})

app.use( router.routes() );



app.listen(8888);