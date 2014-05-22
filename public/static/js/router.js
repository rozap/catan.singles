define([
		'jquery',
		'underscore',
		'backbone',

		'views/login',
		'views/logout',
		'views/register',

	],
	function($, _, Backbone, LoginView, LogoutView, RegisterView) {

		var Router = Backbone.Router.extend({
			routes: {
				'login': 'login',
				'logout': 'logout',
				'register': 'register',
				'profile/:username': 'profile'
			},


			__create: function(cls) {
				this.__main && this.__main.end();
				this.__main = new cls(this.app);
			},


			login: function() {
				this.__create(LoginView);
			},

			logout: function() {
				this.__create(LogoutView);
			},

			register: function() {
				this.__create(RegisterView);
			},

			profile: function(username) {

			}
		})

		return {
			Router: Router
		}

	})