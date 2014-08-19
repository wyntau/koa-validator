## koa-validator
[![Build Status](https://travis-ci.org/Treri/koa-validator.svg?branch=master)](https://travis-ci.org/Treri/koa-validator)
[![NPM version](https://badge.fury.io/js/koa-validator.svg)](http://badge.fury.io/js/koa-validator)
[![Dependency Status](https://david-dm.org/Treri/koa-validator.svg)](https://david-dm.org/Treri/koa-validator)

[![NPM](https://nodei.co/npm/koa-validator.png?downloads=true&stars=true)](https://www.npmjs.org/package/koa-validator)

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
        .use(validator({
            onValidationError: function(errMsg){
                console.log('Validation error:', errMsg);
            }
        }))
        .use(functon *(next){
            this.checkParams('testparam', 'Invalid number').isInt();
            yield next;
        })
        .listen(3000)

### Options
- onValidationError - `function(errMsg)`, default to null. The `errMsg` is the errMsg you defined when you check one variable

    You can define the function like this

        function(errMsg){
            throw new Error('Validation error: ' + errMsg);
        }

- validationErrorFormatter - `function(paramName, errMsg, value)`, the default function is below

        function(paramName, errMsg, value){
            return {
                param: paramName
                , msg: errMsg
                , value: value
            };
        }

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
- haveValidationError, return `true` if have any validationError
- validationErrors, if have any validationError, return an array of error object you returned in `validationErrorFormatter`

### Check
You can use all check methods in `validator.js`.

### Sanitize
You can use all sanitize methods in `validator.js`.

### LICENSE
MIT
