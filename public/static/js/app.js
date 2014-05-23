require.config({

	baseUrl: '/static/js/',


	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	},

	paths: {
		jquery: 'libs/jquery',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		moment: 'libs/moment',


	}

});

require([
	'underscore',
	'backbone',
	'router',
	'util/util',
	'util/auth',
], function(_, Backbone, Router, Util, Auth) {


	var auth = new Auth();
	var app = {
		router: new Router.Router(),
		dispatcher: _.clone(Backbone.Events),
		auth: auth
	}
	app.router.app = app;
	Backbone.history.start();

})