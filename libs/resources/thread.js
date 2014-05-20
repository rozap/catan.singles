var ModelResource = require('../rest-thing/model-resource'),
	Middleware = require('../middleware'),
	UserResource = require('./user');


var ThreadResource = ModelResource.extend({
	listMethods: {
		'post': {
			middleware: Middleware.checkAuth
		},
		'get': {
			skipValidate: true,
		}
	},
	detailMethods: {
		'put': {
			middleware: Middleware.checkAuth
		}
	},
	name: 'thread',

	model: 'Thread',
	exclude: [],

	pageSize: 20,

	belongsTo: {
		'creator': UserResource
	},


	validate: function(req, res) {},

	hydrate: function(body, req, res) {
		body.creator = req.user.get('id');
		return new this.model(body);
	}



});

module.exports = ThreadResource;