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
            creator,
            other_user,
            url = function() {
                return 'http://' + config.host + ':' + config.port + '/api/v1/'
            };


        var makeUser = function(cb) {
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
                    cb(user);
                })

            });
        }


        before(function(done) {
            config = new Config({
                config: 'test'
            });
            models = new Models(config);
            var s = server(config, models);
            makeUser(function(user) {
                creator = user;
                makeUser(function(other) {
                    other_user = other;
                    done();
                })
            });
        });


        it('can start a conversation', function(done) {
            request.post({
                url: url() + 'conversation',
                json: true,
                headers: {
                    'content-type': 'application/json',
                    'auth_token': creator.get('username') + ':' + creator.get('auth_token')
                },
                form: {
                    'other_user': other_user.id
                }
            }, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body.other_user).to.equal(other_user.get('id'))
                expect(body.creator).to.equal(creator.get('id'))

                done();
            });

        });


        it('can list conversations', function(done) {
            request.get({
                url: url() + 'conversation',
                json: true,
                headers: {
                    'content-type': 'application/json',
                    'auth_token': creator.get('username') + ':' + creator.get('auth_token')
                }
            }, function(err, res, body) {
                expect(res.statusCode).to.equal(200);
                expect(body.meta.count).to.equal(1);
                done();
            });

        });



    });
});