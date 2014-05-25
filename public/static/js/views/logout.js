define([
	'underscore',
	'views/abstract',
	'text!templates/auth/logout.html'
], function(_, Views, LogoutViewTemplate) {

	var LogoutView = Views.MainView.extend({

		template: _.template(LogoutViewTemplate),

		initialize: function(app) {
			Views.MainView.prototype.initialize.call(this, app);
			this.app.auth.logout();
			this.render();
		}

	})


	return LogoutView

})