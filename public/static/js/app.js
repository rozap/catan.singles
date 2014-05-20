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
	'router'
], function(_, Backbone, Router) {


	var app = {
		router: new Router.Router(),
		dispatcher: _.clone(Backbone.events),
	}
	app.router.app = app;

	Backbone.history.start();
})