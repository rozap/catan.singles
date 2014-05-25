define([
		'underscore',
		'backbone',
		'moment',
		'text!templates/util/error.html'
	],
	function(_, Backbone, Moment, ErrorTemplate) {

		var AbstractView = Backbone.View.extend({

			errorTemplate: _.template(ErrorTemplate),

			withContext: [],
			_subviews: {},

			initialize: function() {
				this.app = arguments[0];

				_.bindAll(this, 'showError', 'showSuccess', 'render', 'renderIt');
			},

			context: function(ctx) {
				ctx = ctx || {};
				ctx.errors = ctx.errors || false;
				ctx.model = ctx.model || this.model || {};
				ctx.renderError = this.renderError;
				_.each(this.withContext, function(key) {
					ctx[key] = ctx[key] || this[key];
				}, this);
				_.each(ctx, function(val, key) {
					if (val && _.isFunction(val)) {
						ctx[key] = val.bind(this);
					} else if (val && _.isFunction(val.toJSON)) {
						ctx[key] = val.toJSON();
					}
				}, this);



				ctx = _.extend({
					_: _,
					moment: Moment,
					router: this.app.router
				}, ctx);


				return ctx;
			},

			renderIt: function() {
				this.render();
			},

			render: function(ctx) {
				this.trigger('preRender');
				this.preRender && this.preRender(ctx);
				ctx = this.context(ctx);
				this._render(ctx);
				this.postRender && this.postRender(ctx);
				this.trigger('postRender');
			},

			_render: function(ctx) {
				this.$el.html(this.template(ctx));
			},

			end: function() {
				this.stopListening();
				this.trigger('end', this.name);
			},


			hydrate: function(selector) {
				selector = selector || 'form';
				var serialized = this.$el.find(selector).serializeObject();

				console.log(serialized)
				if (this.model) {
					this.model.set(serialized);
				} else {
					this.model = new this.modelCls(serialized, this.app);
				}
				return this.model;
			},

			showError: function(res) {
				console.log(res.responseText)
				var error = JSON.parse(res.responseText);

				var adapted = {}
				_.each(error.errors, function(e) {
					adapted[e.param] = e.msg;
				});
				console.log(adapted);
				this.render({
					errors: adapted
				});
			},

			showSuccess: function(res) {
				console.log(res);
			},

			renderError: function(errors, name) {
				if (errors && errors[name]) {
					return this.errorTemplate({
						msg: errors[name]
					});
				}
				return ''
			},

			addView: function(view, alias) {
				this._subviews[alias || view.cid] = view;
				view.listenTo(this, 'end', view.end.bind(view));
				return view;
			},

			endView: function(aliasOrCid) {
				this._subviews[aliasOrCid].end();
				delete this._subviews[cid];
			},



		});

		var MainView = AbstractView.extend({
			el: '#main-view',
		});


		return {
			AbstractView: AbstractView,
			MainView: MainView
		}


	});