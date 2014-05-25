define([
	'underscore',
	'backbone',
	'models/user'
], function(_, Backbone, User) {

	$.fx.speeds._default = 200;

	(function($, undefined) {

		$(document).on('keyup', function(e) {
			if (e.keyCode === 13) {
				e.preventDefault();
				return false;
			}
		});

		$.fn.serializeObject = function() {
			var obj = {};

			$.each(this.serializeArray(), function(i, o) {
				var n = o.name,
					v = o.value;

				obj[n] = obj[n] === undefined ? v : $.isArray(obj[n]) ? obj[n].concat(v) : [obj[n], v];
			});

			return obj;
		};

	})(jQuery);
});