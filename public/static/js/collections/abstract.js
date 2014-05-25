define([
	'underscore',
	'backbone',
], function(_, Backbone) {

	var Collection = Backbone.Collection.extend({

		initialize: function(props, app) {
			this.app = app;
			if (!this.app) throw new Error('No app provided to model...');
		},

		url: function() {
			return '/api/v1/' + this.api();
		},


		sync: function(method, model, options) {
			var opts = options || {};
			var self = this;
			opts.beforeSend = function(xhr) {
				self.app.auth.setHeaders(xhr);
			};
			return Backbone.Collection.prototype.sync.call(this, method, model, opts);
		},

		parse: function(resp) {
			console.log(resp);
			this._meta = resp.meta;
			var root = _.without(_.keys(resp), 'meta')[0];
			return resp[root];
		}

	});

	return {
		Collection: Collection
	};
})