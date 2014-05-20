#!/usr/bin/env node

var Models = require('./models/index'),
	Config = require('./config/config'),
	Promise = require('bluebird'),
	_ = require('underscore');


var conf = new Config({
	config: 'dev'
});
var models = new Models(conf);



var User = models.User;
var Thread = models.Thread;
var Comment = models.Comment;

var done = _.after(25, function() {
	console.log('done!');
})

Comment.collection().query().delete()
	.then(function() {
		return Thread.collection().query().delete()
	})
	.then(function() {
		return User.collection().query().delete()
	})
	.then(function() {


		for (var i = 0; i < 5; i++) {
			var u = new User({
				username: 'user' + i,
				password: 'pass' + i,

			});
			u.save().then(function(user) {
				var t = new Thread({
					creator: user.get('id'),
					body: 'thread body ' + i,
					title: 'thread title ' + i,
				});
				t.save().then(function(thread) {
					for (var j = 0; j < 5; j++) {
						var c = new Comment({
							thread: thread.get('id'),
							creator: user.get('id'),
							body: 'comment ' + j
						});

						c.save().then(function() {
							done();
						})
					}
				});
			});
		}
	})