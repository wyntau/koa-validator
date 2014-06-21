var koa = require('koa')
    , request = require('supertest')
    , bodyParser = require('koa-bodyparser')
    , router = require('koa-router')
    , async = require('async')

    , validator = require('..')
    , createApp = function(){
        var app = koa();
        app.use(bodyParser());
        app.use(validator());
        app.use(router(app));
        app.use(function *(next){
            console.log(this.checkParams);
            yield next;
        });
        return app;
    }
    ;

describe('validator', function(){
    it('should parse params', function(done){
        var app = createApp();

        app.get('/:testparam', function *(next){
            this.checkParams('testparam', 'Parameter is not an integer').isInt();

            this.sanitizeParams('testparam').toInt();

            var errors = this.validationErrors();
            if(errors){
                this.body = errors;
            }else{
                this.body = {
                    testparam: this.params.testparam
                };
            }
        });

        request(app.listen())
            .get('/123')
            .expect(function(res){
                res.body.should.deep.equal({
                    testparam: 123
                });
            })
            .end(done)
            ;
    });

    it('should parse query', function(done){
        var app = createApp();

        app.get('/test', function *(next){
            this.checkQuery('testparam', 'Parameter is not an integer').isInt();

            this.sanitizeQuery('testparam').toInt();

            var errors = this.validationErrors();
            if(errors){
                this.body = errors;
            }else{
                this.body = {
                    testparam: this.query.testparam
                };
            }
        });

        async.parallel([
            function(done){
                request(app.listen())
                    .get('/test?testparam=123')
                    .expect(function(res){
                        res.body.should.deep.equal({
                            testparam: 123
                        });
                    })
                    .end(done)
                    ;
            }
            , function(done){
                request(app.listen())
                    .get('/test?testparam=gettest')
                    .expect(function(res){
                        res.body[0].msg.should.equal('Parameter is not an integer')
                    })
                    .end(done)
                    ;
            }
        ], done);
    });

    it('should parse body', function(done){
        var app = createApp();

        app.post('/test', function *(next){
            this.checkBody('testparam', 'Parameter is not an integer').isInt();

            this.sanitizeBody('testparam').toInt();

            var errors = this.validationErrors();
            if(errors){
                this.body = errors;
            }else{
                this.body = {
                    testparam: this.request.body.testparam
                };
            }
        });

        async.parallel([
            function(done){
                request(app.listen())
                    .post('/test')
                    .send({
                        testparam: '123'
                    })
                    .expect(function(res){
                        res.body.should.deep.equal({
                            testparam: 123
                        });
                    })
                    .end(done)
                    ;
            }
            , function(done){
                request(app.listen())
                    .post('/test')
                    .send({
                        testparam: 'gettest'
                    })
                    .expect(function(res){
                        res.body[0].msg.should.equal('Parameter is not an integer');
                    })
                    .end(done)
                    ;
            }
        ], done);
    });

    it('should throw error when set onValidationError cbk', function(done){
        var app = createApp();

        app.get('/test', function *(next){
            this.onValidationError(function(msg){
                this.throw(402, msg);
            });
            this.checkQuery('testparam', 'Parameter is not an integer').isInt();
        });

        request(app.listen())
            .get('/test?testparam=gettest')
            .expect(402, 'Parameter is not an integer')
            .end(done)
            ;
    });

    it('should return mapped errors', function(done){
        var app = createApp();

        app.get('/test', function *(next){
            this.checkQuery('testparam', 'Parameter is not an integer').isInt();

            var errors = this.validationErrors(true);
            if(errors){
                this.body = errors;
            }else{
                this.body = {
                    testparam: this.query.testparam
                };
            }
        });

        request(app.listen())
            .get('/test?testparam=gettest')
            .expect(function(res){
                res.body.should.deep.equal({
                    testparam: {
                        param: 'testparam'
                        , msg: 'Parameter is not an integer'
                        , value: 'gettest'
                    }
                });
            })
            .end(done)
            ;
    });
});