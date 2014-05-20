var ModelResource = require('../rest-thing/model-resource'),
	Middleware = require('../middleware'),
	UserResource = require('./user'),
	Promise = require('bluebird');


var CommentResource = ModelResource.extend({
	listMethods: {
		'post': {
			middleware: Middleware.checkAuth
		},
		'get': {}
	},
	detailMethods: {
		'put': {
			middleware: Middleware.checkAuth
		}
	},
	name: 'comment',

	model: 'Comment',
	exclude: [],

	filters: ['thread'],

	pageSize: 200,

	belongsTo: {
		'creator': UserResource,
	},


	applyValidation: function(req, res) {
		req.assert("thread", "Include a thread id").notEmpty();
	},



});

module.exports = CommentResource;