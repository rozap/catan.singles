define([
	'underscore',
	'backbone',
], function(_, Backbone) {

	var Model = Backbone.Model.extend({

		initialize: function(props, app) {
			this.app = app;
			if (!this.app) throw new Error('No app provided to model...');
		},

		url: function() {
			return '/api/v1/' + this.at();
		},


		sync: function(method, model, options) {
			var opts = options || {};
			var self = this;
			opts.beforeSend = function(xhr) {
				self.app.auth.setHeaders(xhr);
			};
			return Backbone.Model.prototype.sync.call(this, method, model, opts);
		},

		setNew: function() {
			this.isNew = function() {
				return true
			};
			return this;
		}


	});

	return {
		Model: Model
	};
})