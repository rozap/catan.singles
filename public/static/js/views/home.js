define([
	'underscore',
	'views/abstract',
	'text!templates/home.html'
], function(_, Views, HomeViewTemplate) {

	var HomeView = Views.MainView.extend({

		template: _.template(HomeViewTemplate),

		initialize: function(app) {
			Views.MainView.prototype.initialize.call(this, app);
			console.log('home view')
			this.render();
		}

	})


	return HomeView

})