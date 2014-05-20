define([
		'jquery',
		'underscore',
		'backbone',

		'views/login',
		'views/logout',

	],
	function($, _, Backbone, LoginView, LogoutView) {

		var Router = Backbone.Router.extend({
			routes: {
				'login': 'login',
				'logout': 'logout',
				'profile/:username': 'profile'
			},


			__create: function(cls) {
				this.__main && this.__main.end();
				this.__main = new cls(this.app);
			},


			login: function() {
				console.log('login')
				this.__create(LoginView);
			},

			logout: function() {
				this.__create(LogoutView);
			},

			profile: function(username) {

			}
		})

		return {
			Router: Router
		}

	})