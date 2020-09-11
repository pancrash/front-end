const fs = require('fs');

const defaultOptions = {
    prefix: '',
    dir: ''
}

module.exports = (options) => {

    options = {...defaultOptions, ...options};

    return async (ctx, next) => {
        /*
        * ctx
        *   req => 原生的Nodejs的InComingMessage对象
        *   res => 原生的Nodejs的ServerResponse对象
        *
        *   request => 被koa包装过的
        *   response => 被koa包装过的
        * */
        // console.log('static 中间件')

        // const file = __dirname + '/../public/' + url;

        // console.log(ctx.request.url);
        // console.log(ctx.url);

        // const file = options.dir;
        // console.log(file)

        if ( ctx.url.startsWith(options.prefix) ) {
            // console.log('...')
            let file = options.dir + ctx.url.replace(options.prefix, '');


            ctx.body = fs.readFileSync(file).toString();
        } else {
            await next();
        }


    }
}