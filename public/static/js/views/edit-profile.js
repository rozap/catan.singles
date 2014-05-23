define([
	'underscore',
	'views/abstract',
	'models/user',
	'text!templates/users/edit-profile.html'
], function(_, Views, User, EditProfileViewTemplate) {

	var EditProfileView = Views.MainView.extend({

		template: _.template(EditProfileViewTemplate),

		initialize: function(app, args) {
			Views.MainView.prototype.initialize.call(this, app);

			this.model = app.auth.getUser();
			this.listenTo(this.model, 'sync', this.renderIt);
			this.model.fetch();
		}

	})


	return EditProfileView

});