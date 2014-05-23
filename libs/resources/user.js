var ModelResource = require('../rest-thing/model-resource'),
	Middleware = require('../middleware'),
	Promise = require('bluebird');


var UserResource = ModelResource.extend({
	listMethods: {
		'post': {},
		'get': {
			skipValidate: true,
			middleware: Middleware.checkAuth
		}
	},
	detailMethods: {
		'put': {
			middleware: Middleware.checkAuth
		},
		'get': {
			middleware: Middleware.checkAuth
		},
		'post': {},

	},
	name: 'user',
	detailParam: 'username',
	model: 'User',
	exclude: ['password', 'active', 'email', 'auth_token'],

	pageSize: 20,



	validateOnListPost: function(req, res) {
		var resolver = Promise.defer();
		req.assert('password', 'Invalid Password.').notEmpty();
		req.assert('password_confirmation', 'Passwords do not match.').equals(
			req.body.password);


		var errors = req.validationErrors();
		if (errors) {
			resolver.reject({
				status: 400,
				errors: errors
			});
		} else {
			new this.model({
				username: req.body.username
			}).fetch().then(function(user) {
				if (user) {
					resolver.reject({
						status: 400,
						errors: [{
							'param': 'username',
							'msg': 'That username is taken'
						}]

					});

				} else {
					resolver.resolve();
				}
			});
		}

		return resolver.promise;
	},

	validate: function(req, res) {},

	hydrate: function(body) {
		delete body.password_confirmation;
		body.auth_token = this.model.randomToken();
		return ModelResource.prototype.hydrate.call(this, body);
	},

	dehydrate: function(bundle, req, res) {
		if (req.user && req.user.get('id') === bundle.id) {
			console.log('is self!');
			bundle.email = req.user.get('email');
			bundle.auth_token = req.user.get('auth_token')
			bundle.self = true;
		}
		return Promise.resolve(bundle);
	},

	validateOnDetailPost: function(req, res) {
		var resolver = Promise.defer(),
			self = this;
		req.assert('password', 'Invalid Password.').notEmpty();
		req.assert('username', 'Invalid Username.').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			resolver.reject({
				status: 400,
				errors: errors
			});
		} else {
			new this.model({
				username: req.body.username
			}).fetch().then(function(user) {
				console.log(user)
				if (!user) {
					resolver.reject({
						status: 400,
						errors: [{
							param: 'username',
							msg: 'User not found'
						}]
					});
					return;
				}

				user.validatePassword(req.body.password, function(err, isMatch) {

					if (err || isMatch) {
						resolver.reject({
							status: 400,
							errors: [{
								param: 'password',
								msg: 'Invalid password'
							}]
						})
					}

					user.save({
						auth_token: self.model.randomToken()
					}).then(function(user) {
						req.user = user;
						resolver.resolve();
					})
				});
			});
		}

		return resolver.promise;
	},



});

module.exports = UserResource;