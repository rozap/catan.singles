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
	'views/messenger',
	'util/util',
	'util/auth',
], function(_, Backbone, Router, Messenger, Util, Auth) {


	var auth = new Auth();
	var app = {
		router: new Router.Router(),
		dispatcher: _.clone(Backbone.Events),
		auth: auth
	}
	auth.app = app;
	app.router.app = app;

	app.dispatcher.on('all', function(ev, arg) {
		console.log(ev, arg)
	})

	//nobody gets a ref to this
	var messengerView = new Messenger(app);


	//away we go...
	Backbone.history.start();
	console.log('start')

})