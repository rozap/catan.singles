define([
	'underscore',
	'views/abstract',
	'models/user',
	'text!templates/auth/register.html'
], function(_, Views, User, RegisterViewTemplate) {

	var RegisterView = Views.MainView.extend({

		template: _.template(RegisterViewTemplate),

		events: {
			'click .register-button': 'register'
		},

		modelCls: User,

		initialize: function(app) {
			Views.MainView.prototype.initialize.call(this, app);
			this.render();
		},


		register: function(e) {
			this.hydrate().setNew().save().then(this.showSuccess, this.showError);
		},



	})


	return RegisterView

})