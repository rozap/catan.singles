var assert = require('chai').assert,
    expect = require('chai').expect,
    _ = require('underscore'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    Config = require('../config/config'),
    Models = require('../models/index'),
    server = require('../libs/server');



describe('Account resource test', function() {

    describe('#initialization()', function() {

        var config,
            models,
            url = function() {
                return 'http://' + config.host + ':' + config.port + '/api/v1/'
            };



        before(function() {
            config = new Config({
                config: 'test'
            });
            models = new Models(config);
            var s = server(config, models);
        });



        it('can register a user', function(done) {
            var rand = Math.random() * 10000;
            var pass = 'foobar' + rand;
            var username = 'foo' + rand;
            request.post({
                url: url() + 'user',
                json: true,
                headers: {
                    'content-type': 'application/json'
                },
                form: {
                    'username': username,
                    'password': pass,
                    'password_confirmation': pass
                }
            }, function(err, res, body) {
                expect(res.statusCode).to.equal(200);

                new models.User({
                    username: username
                }).fetch().then(function(user) {
                    expect(user.get('username')).to.equal(username);
                    done();
                })

            });
        });


        it('need to confirm password', function(done) {
            var rand = Math.random() * 10000;
            var pass = 'foobar' + rand;
            var username = 'foo' + rand;
            request.post({
                url: url() + 'user',
                json: true,
                headers: {
                    'content-type': 'application/json'
                },
                form: {
                    'username': username,
                    'password': pass,
                }
            }, function(err, res, body) {
                expect(res.statusCode).to.equal(400);
                expect(body.errors[0].param).to.equal('password_confirmation');
                done();


            });
        });


        it('cannot have conflicting usernames', function(done) {
            var rand = Math.random() * 10000;
            var pass = 'foobar' + rand;
            var username = 'fooFOO' + rand;
            request.post({
                url: url() + 'user',
                json: true,
                headers: {
                    'content-type': 'application/json'
                },
                form: {
                    'username': username,
                    'password': pass,
                    'password_confirmation': pass
                }
            }, function(err, res, body) {
                expect(res.statusCode).to.equal(200);

                request.post({
                    url: url() + 'user',
                    json: true,
                    headers: {
                        'content-type': 'application/json'
                    },
                    form: {
                        'username': username,
                        'password': pass,
                        'password_confirmation': pass
                    }
                }, function(err, res, body) {
                    expect(res.statusCode).to.equal(400);

                    done();

                });


            });
        });
    });
});