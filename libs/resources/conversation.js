var ModelResource = require('../rest-thing/model-resource'),
	Middleware = require('../middleware'),
	Promise = require('bluebird'),
	UserResource = require('./user');


var ConversationResource = ModelResource.extend({
	listMethods: {
		'post': {
			middleware: Middleware.checkAuth
		},
		'get': {
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
	name: 'conversation',
	model: 'Conversation',

	belongsTo: {
		'creator': UserResource,
		'other_user': UserResource
	},

	pageSize: 20,



	applyFilters: function(req, qb) {
		ModelResource.prototype.applyFilters.call(this, req, qb);
		var id = req.user.get('id');
		return qb.where('creator', id).orWhere('other_user', id);
	},

	validateOnListPost: function(req, res) {
		var resolver = Promise.defer();
		var User = this.getModel('User');
		new User({
			id: req.body.other_user
		}).fetch().then(function(other) {
			if (other) {
				return resolver.resolve();
			}
			return resolver.reject({
				status: 400,
				errors: [{
					param: 'other_user',
					msg: 'That user does not exist'
				}]
			});
		});


		return resolver.promise;
	},


	hydrate: function(body, req, res) {
		body.creator = req.user.get('id');
		return ModelResource.prototype.hydrate.call(this, body, req, res);
	}



});

module.exports = ConversationResource;