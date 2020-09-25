const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaBody = require('koa-body');
const KoaStaticCache = require('koa-static-cache');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken')

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'burke189',
    database: 'kkb_shop'
});

function query(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, function (err, results) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    })
}

const app = new Koa();
const router = new KoaRouter();



app.use(KoaStaticCache(
    {
        dir: __dirname + '/public',
        prefix: '/public',
        gzip: true,
        dynamic: true
    }
))
app.use(KoaStaticCache(
    {
        dir: __dirname + '/static',
        prefix: '/static',
        gzip: true,
        dynamic: true
    }
))

const uploadOptions = {
    multipart: true,
    formidable: {
        uploadDir: __dirname + '/static/upload',
        keepExtensions: true
    }
}
router.post('/upload',verifyAuth, KoaBody(uploadOptions), async ctx => {
    // console.log(ctx.request.files);
    let { path, type, size } = ctx.request.files.attachment;
    path = path.replace(/\\/g, '/');
    let lastIndex = path.lastIndexOf('/');
    let filename = path.substring(lastIndex + 1);
    let rs = await query(
        "insert into `photos` (`filename`, `type`, `size`, `uid`) values (?, ?, ?, ?)",
        [filename, type, size, ctx.state.user.uid]
    )

    ctx.body = {
        code: 0,
        message: '',
        data: filename
    };
});
router.get('/getPhotos', verifyAuth, async ctx => {
    let photos = await query(
        "select * from photos where `uid`=?",
        [ctx.state.user.uid]
    );

    ctx.body = {
        code: 0,
        message: '',
        data: photos
    };
})

router.post('/login', KoaBody({ multipart: true }), async ctx => {
    const { username, password } = ctx.request.body;
    let [user] = await query(
        "select * from `users` where `username`=? and `password`=?",
        [username, password]
    )
    if (!user) {
        return ctx.body = {
            code: 1,
            message: '用户名或密码错误'
        }
    }
    let token = jwt.sign({ uid: user.uid, username: user.username }, 'pancras');
    ctx.set('authorization', token);
    ctx.body = {
        code: 0,
        message: '登陆成功',
        data: user
    }
})

app.use(router.routes());

app.listen(8888);

async function verifyAuth(ctx, next) {
    let authorization = ctx.get('authorization');
    let user;
    try {
        user = jwt.verify(authorization, 'pancras');
    } catch (e) { }
    if (user) {
        ctx.state.user = user;
        await next();
    } else {
        ctx.throw(401);
    }
}