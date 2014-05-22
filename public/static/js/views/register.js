define([
	'underscore',
	'views/abstract',
	'text!templates/auth/register.html'
], function(_, Views, RegisterViewTemplate) {

	var RegisterView = Views.MainView.extend({

		template: _.template(RegisterViewTemplate),

		initialize: function(app) {
			Views.MainView.prototype.initialize.call(this, app);
			this.render();
		}

	})


	return RegisterView

})