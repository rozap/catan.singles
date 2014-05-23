define([
	'underscore',
	'views/abstract',
	'models/user',
	'text!templates/auth/login.html'
], function(_, Views, User, LoginViewTemplate) {

	var LoginView = Views.MainView.extend({

		template: _.template(LoginViewTemplate),

		events: {
			'click .login-button': 'login',
		},

		modelCls: User,

		initialize: function(app) {
			Views.MainView.prototype.initialize.call(this, app);
			this.render();
		},


		login: function(e) {
			this.model = this.hydrate();
			this.model.sync('create', this.model).then(this.showSuccess, this.showError);
		},

		showSuccess: function(res) {
			this.model.set(res);
			this.app.auth.memo(this.model);
			this.app.router.navigate('profile/' + this.model.get('username'), {
				trigger: true
			});
		},

	})


	return LoginView

})