define([
	'underscore',
	'views/abstract',
	'models/user',
	'text!templates/users/profile.html'
], function(_, Views, User, ProfileViewTemplate) {

	var ProfileView = Views.MainView.extend({

		template: _.template(ProfileViewTemplate),

		initialize: function(app, args) {
			Views.MainView.prototype.initialize.call(this, app);
			console.log(args)
			this.model = new User({
				username: args[0]
			}, app);
			this.listenTo(this.model, 'sync', this.renderIt);
			this.model.fetch();
		}

	})


	return ProfileView

});