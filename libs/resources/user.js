var ModelResource = require('../rest-thing/model-resource'),
	Middleware = require('../middleware'),
	Promise = require('bluebird');


var UserResource = ModelResource.extend({
	listMethods: {
		'post': {},
		'get': {
			skipValidate: true,
			// middleware: Middleware.checkAuth
		}
	},
	detailMethods: {
		'put': {
			middleware: Middleware.checkAuth
		}

	},
	name: 'user',


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
		console.log(req.user)
		if (req.user && req.user.get('id') === bundle.id) {
			console.log('is self!')
		}
		return Promise.resolve(bundle);
	}



});

module.exports = UserResource;