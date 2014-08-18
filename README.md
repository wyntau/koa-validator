## koa-validator
[![Build Status](https://travis-ci.org/Treri/koa-validator.svg?branch=master)](https://travis-ci.org/Treri/koa-validator)
[![NPM version](https://badge.fury.io/js/koa-validator.svg)](http://badge.fury.io/js/koa-validator)
[![Dependency Status](https://david-dm.org/Treri/koa-validator.svg)](https://david-dm.org/Treri/koa-validator)

[![NPM](https://nodei.co/npm/koa-validator.png?downloads=true&stars=true)](https://nodei.co/npm/koa-validator.png?downloads=true&stars=true)

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