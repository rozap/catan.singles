define([
		'jquery',
		'underscore',
		'backbone',

		'views/login',
		'views/logout',
		'views/register',
		'views/profile',
		'views/edit-profile',

	],
	function($, _, Backbone, LoginView, LogoutView, RegisterView, ProfileView, EditProfileView) {

		var Router = Backbone.Router.extend({
			publicRouteMap: {
				'login': LoginView,
				'logout': LogoutView,
				'register': RegisterView,
			},

			authRouteMap: {
				'profile/:username/edit': EditProfileView,
				'profile/:username': ProfileView
			},

			initialize: function() {
				this.__addRoutes(this.publicRouteMap, this.createView);
				this.__addRoutes(this.authRouteMap, this.authView);
			},

			__addRoutes: function(routeMap, fn) {
				_.each(routeMap, function(cls, route) {
					this.route(route, _.partial(fn, cls));
				}, this);

			},

			createView: function(cls) {
				this.__main && this.__main.end();
				var args = Array.prototype.slice.call(arguments);
				this.__main = new cls(this.app, args.slice(1));
			},

			authView: function(cls) {
				var self = this;
				if (!this.app.auth.isAuthorized()) {
					this.app.auth.authorize(this.app).then(function() {
						self.createView(cls);
					}, function() {
						self.navigate('login', {
							trigger: true
						});
					});
				} else {
					self.createView(cls);
				}

			},


			linkTo: function(routeName) {}

		})

		return {
			Router: Router
		}

	})