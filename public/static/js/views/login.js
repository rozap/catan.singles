define([
	'underscore',
	'views/abstract',
	'text!templates/auth/login.html'
], function(_, Views, LoginViewTemplate) {

	var LoginView = Views.MainView.extend({

		template: _.template(LoginViewTemplate),

		initialize: function(app) {
			Views.MainView.prototype.initialize.call(this, app);
			this.render();
		}

	})


	return LoginView

})