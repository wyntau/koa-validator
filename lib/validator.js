var validator = require('validator')
    ;

var koaValidator = function(options){
    options = options || {};

    var _options = {};

    _options.errorFormatter = options.errorFormatter || function(param, msg, value){
        return {
            param: param
            , msg: msg
            , value: value
        };
    };

    var sanitizers = [
        'trim'
        , 'ltrim'
        , 'rtrim'
        , 'escape'
        , 'stripLow'
        , 'whitelist'
        , 'blacklist'
    ];

    function getParams(ctx, name){
        return ctx.params && ctx.params[name];
    }

    function getQuery(ctx, name){
        return ctx.query && ctx.query[name];
    }

    function getBody(ctx, name){
        return ctx.request.body && ctx.request.body[name];
    }

    function getHeader(ctx, name){
        var toCheck;

        if (name === 'referrer' || name === 'referer') {
            toCheck = ctx.headers.referer;
        } else {
            toCheck = ctx.headers[name];
        }
        return toCheck || '';
    }

    function updateParams(ctx, name, value){
        // route params like /user/:id
        if (ctx.params && ctx.params.hasOwnProperty(name) &&
            undefined !== ctx.params[name]) {
            return ctx.params[name] = value;
        }
        return false;
    }

    function updateQuery(ctx, name, value){
        // query string params
        if (undefined !== ctx.query[name]) {
            return ctx.query[name] = value;
        }
        return false;
    }

    function updateBody(ctx, name, value){
        // request body params via connect.bodyParser
        if (ctx.request.body && undefined !== ctx.request.body[name]) {
            return ctx.request.body[name] = value;
        }
        return false;
    }

    function makeSanitize(field){
        var getter = field === 'params' ? getParams :
                     field === 'query' ? getQuery :
                     getBody
            , updater = field === 'params' ? updateParams :
                        field === 'query' ? updateQuery :
                        updateBody
            ;
        return function(name){
            var ctx = this
                , value = getter(ctx, name)
                , methods = {}
                ;

            Object.keys(validator).forEach(function(methodName){
                if(methodName.match(/^to/) || sanitizers.indexOf(methodName) !== -1){
                    methods[methodName] = function(){
                        var args = [value].concat(Array.prototype.slice.call(arguments));
                        var result = validator[methodName].apply(validator, args);
                        updater(ctx, name, result)
                        return result;
                    };
                }
            });

            return methods;
        }
    }

    function makeCheck(field){
        var getter = field === 'params' ? getParams :
                     field === 'query' ? getQuery :
                     field === 'body' ? getBody :
                     getHeader
            ;

        return function(param, failMsg){
            var ctx = this
                , value
                ;

            if(!Array.isArray(param)){
                param = typeof param === 'number' ?
                    [param] :
                    param.split('.').filter(function(e){
                        return e !== '';
                    });
            }

            param.map(function(item){
                if(value === undefined){
                    value = getter(ctx, item);
                }else{
                    value = value[item];
                }
            });

            param = param.join('.');

            var errorHandler = function(msg){
                var error = _options.errorFormatter(param, msg, value);

                if (ctx._validationErrors === undefined) {
                    ctx._validationErrors = [];
                }
                ctx._validationErrors.push(error);

                if (ctx.onErrorCallback) {
                    ctx.onErrorCallback(msg);
                }
                return this;
            };

            var methods = {};

            Object.keys(validator).forEach(function(methodName) {
                if (!methodName.match(/^to/) && sanitizers.indexOf(methodName) === -1) {
                    methods[methodName] = function() {
                        var args = [value].concat(Array.prototype.slice.call(arguments));
                        var isCorrect = validator[methodName].apply(validator, args);

                        if (!isCorrect) {
                            errorHandler(failMsg || 'Invalid value');
                        }

                        return methods;
                    }
                }
            });

            methods['notEmpty'] = function() {
                return methods.isLength(1);
            };

            methods['len'] = function() {
                return methods.isLength.apply(methods.isLength, Array.prototype.slice.call(arguments));
            };

            return methods;
        };
    }

    return function *(next){
        var ctx = this;

        ctx.sanitizeParams = makeSanitize('params');
        ctx.sanitizeQuery = makeSanitize('query');
        ctx.sanitizeBody = makeSanitize('body');

        ctx.checkParams = makeCheck('params');
        ctx.checkQuery = makeCheck('query');
        ctx.checkBody = makeCheck('body');
        ctx.checkHeader = makeCheck('header');

        ctx.assertParams = ctx.checkParams;
        ctx.assertQuery = ctx.checkQuery;
        ctx.assertBody = ctx.checkBody;
        ctx.assertHeader = ctx.checkHeader;

        ctx.onValidationError = function(errback) {
            this.onErrorCallback = errback;
        };

        ctx.validationErrors = function(mapped) {
            if (this._validationErrors === undefined) {
                return null;
            }
            if (mapped) {
                var errors = {};
                this._validationErrors.forEach(function(err) {
                    errors[err.param] = err;
                });
                return errors;
            }
            return this._validationErrors;
        };

        yield next;

    };
};

module.exports = koaValidator;
module.exports.validator = validator;