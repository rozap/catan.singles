module.exports.checkAuth = function(config, req, res, next) {

	var fail = function() {
		res.json(403, {
			errors: 'invalid auth token'
		});
	}

	var token = req.headers['auth_token'];
	if (!token) fail();


	new config.models.User({
		auth_token: token,
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