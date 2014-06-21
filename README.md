## koa-validator

a koa port of express-validator

### Install

    npm install koa-validator

### Usage

    var koa = require('koa')
        , validator = require('koa-validator')
        , bodyParser = require('koa-bodyparser')

        , app = koa()
        ;

    app
        .use(bodyParser())
        .use(validator())
        .use(functon *(next){
            this.checkParams('testparam', 'Invalid number').isInt();
            yield next;
        })
        .listen(3000)

### Note
If you will use `checkBody` or `assertBody`, you should use one bodyparse middleware before validator.

### Test

    npm test

### API
- checkParams
- checkQuery
- checkBody
- checkHeader
- sanitizeParams
- sanitizeQuery
- sanitizeBody
- assertParams => checkParams
- assertQuery => checkQuery
- assertBody => checkBody
- assertHeader => checkHeader
- onValidationError
- validationErrors

### LICENSE
MIT