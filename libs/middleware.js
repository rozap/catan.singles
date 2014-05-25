module.exports.checkAuth = function(config, req, res, next) {

	var fail = function() {
		res.json(403, {
			errors: 'invalid auth token'
		});
	}

	var things = req.headers['auth_token'];
	if (!things) {
		fail();
		return;
	}
	var sp = things.split(':');
	var username = sp[0];
	var token = sp[1];

	new config.models.User({
		auth_token: token,
		username: username,
		active: true
	}).fetch().then(function(user) {
		if (user) {
			req.user = user;
			next();
		} else {
			fail();
		}
	});

}