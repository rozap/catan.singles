define([
		'underscore',
		'backbone',
		'moment',
	],
	function(_, Backbone, Moment) {

		var AbstractView = Backbone.View.extend({



			context: function(ctx) {
				ctx = _.extend({
					_: _,
					moment: Moment,

				}, ctx);
			},


			render: function(ctx) {
				this.trigger('preRender');
				ctx = this.context(ctx);
				this._render(ctx);
				this.trigger('postRender');
			},

			_render: function(ctx) {
				this.$el.html(this.template(ctx));
			},

			end: function() {
				this.stopListening();
				this.trigger('end', this.name);
			},


		});

		var MainView = AbstractView.extend({
			el: '#main',
		});


		return {
			AbstractView: AbstractView,
			MainView: MainView
		}


	});