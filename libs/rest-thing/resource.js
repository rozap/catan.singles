var _ = require('underscore'),
	Promise = require('bluebird'),
	util = require('util'),
	EventEmitter = require('events').EventEmitter;

var Resource = function(opts) {
	this._opts = opts;
	_.extend(this, opts);
	if (!this.app) throw new Error('No application object provided!');
	if (!this.name) throw new Error('No name for resource provided!');
	if (!this.config) throw new Error('No Config provided!');

	_.bindAll(this, '_dispatchDetail', '_dispatchList');

	this.initialize.apply(this, arguments);
	this._setupListMethods();
	this._setupDetailMethods();


}

Resource.extend = function(protoProps, staticProps) {
	var parent = this;
	var child;
	if (protoProps && _.has(protoProps, 'constructor')) {
		child = protoProps.constructor;
	} else {
		child = function() {
			return parent.apply(this, arguments);
		};
	}
	_.extend(child, parent, staticProps);
	var Surrogate = function() {
		this.constructor = child;
	};
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;
	if (protoProps) _.extend(child.prototype, protoProps);

	child.__super__ = parent.prototype;
	return child;
};


util.inherits(Resource, EventEmitter);
Resource.prototype = {

	detailParam: 'id',


	toJSON: function() {
		throw new Error('not implemented');
	},



	_capitalizeFirst: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},


	_setupListMethods: function() {
		this._bindUrls(this.listMethods, 'onList', '', this._dispatchList);
	},

	_setupDetailMethods: function() {
		this._bindUrls(this.detailMethods, 'onDetail', '/:' + this.detailParam, this._dispatchDetail);
	},



	_bindUrls: function(methods, urlPrefix, suffix, dispatcher) {
		var that = this;
		_.each(methods, function(methodOptions, httpMethod) {

			var boundMethodName = methodOptions.boundMethodName || (urlPrefix + this._capitalizeFirst(httpMethod)),
				middleware = methodOptions.middleware,
				dispatch = function(req, res) {
					dispatcher(httpMethod, boundMethodName, req, res);
				},
				apiBase = this.config.apiBase;

			if (middleware) {
				this.app[httpMethod](this.apiUrl() + suffix, _.partial(middleware, that.config), dispatch);
			} else {
				this.app[httpMethod](this.apiUrl() + suffix, dispatch);
			}

		}, this)

	},

	apiUrl: function() {
		return this.config.apiBase + this.name;
	},

	_dispatch: function(methods, httpMethod, boundMethodName, req, res) {
		var that = this;
		Promise.all([
			this.isValid(req, res, boundMethodName, methods[httpMethod].skipValidate),
			this.isAuthorized(req, res, boundMethodName, methods[httpMethod].skipAuthorize)
		]).then(function() {
			that[boundMethodName](req, res);
		}).
		catch(function(ret) {
			res.json(ret.status, {
				errors: ret.errors
			});

		});
	},


	_dispatchList: function(httpMethod, boundMethodName, req, res) {
		return this._dispatch(this.listMethods, httpMethod, boundMethodName, req, res);

	},


	_dispatchDetail: function(httpMethod, boundMethodName, req, res) {
		return this._dispatch(this.detailMethods, httpMethod, boundMethodName, req, res);
	},


	applyValidation: function(req, res) {
		//noop
	},


	validate: function(req, res) {
		this.applyValidation(req, res);
		var errors = req.validationErrors();
		if (errors) {
			return Promise.reject({
				status: 400,
				errors: errors
			});
		}
		return Promise.resolve();
	},


	authorized: function(req, res) {
		return Promise.resolve();
	},

	isAuthorized: function(req, res, boundMethodName, shouldSkip) {
		if (shouldSkip) {
			return Promise.resolve();
		}
		var customMethod = 'authorized' + this._capitalizeFirst(boundMethodName);
		return Promise.all([
			this[customMethod] && this[customMethod](req, res),
			this.authorized(req, res)
		])
	},

	isValid: function(req, res, boundMethodName, shouldSkip) {
		if (shouldSkip) {
			return Promise.resolve();
		}
		var customMethod = 'validate' + this._capitalizeFirst(boundMethodName);
		return Promise.all([
			(this[customMethod] && this[customMethod](req, res)),
			this.validate(req, res)
		]);

	},


	onListGet: function(req, res) {

	},

	onListPost: function(req, res) {},

	onListPut: function(req, res) {

	},

	onListDelete: function(req, res) {

	},

	onDetailGet: function(req, res) {

	},

	onDetailPost: function(req, res) {

	},

	onDetailPut: function(req, res) {

	},

	onDetailDelete: function(req, res) {

	},



}


module.exports = Resource;