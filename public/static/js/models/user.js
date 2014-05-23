define([
	'underscore',
	'backbone',
	'models/abstract'

], function(_, Backbone, Abstract) {

	var User = Abstract.Model.extend({

		idAttribute: 'username',

		at: function() {
			console.log(this.get('username'), 'user/' + (this.isNew() ? '' : this.get('username')))
			return 'user/' + (this.isNew() ? '' : this.get('username'));
		}


	});

	return User;
})