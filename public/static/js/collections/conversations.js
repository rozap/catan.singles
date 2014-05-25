define([
	'underscore',
	'backbone',
	'collections/abstract',
], function(_, Backbone, Abstract) {

	var Messages = Abstract.Collection.extend({

		api: function() {
			return 'conversation'
		},



	});

	return Messages
})