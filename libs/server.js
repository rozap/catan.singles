var express = require('express'),
	expressValidator = require("express-validator"),
	session = require("express-session"),
	nunjucks = require('nunjucks'),
	Api = require('./api');


module.exports = function(config, models) {
	var app = express();
	var server = app.listen(config.port, config.host);
	nunjucks.configure(__dirname + '/views', {
		autoescape: true,
		express: app
	});


	app.configure(function() {
		app.use(express.bodyParser());

		app.use(express.json());
		app.use(expressValidator());

		app.use(express.cookieParser());

		app.use(session({
			secret: config.cookie.secret
		}));
	});


	var up = '../' + __dirname;
	app.use('/public', express.static(up + '/public'));
	// app.use('/media', express.static(up + '/public/media'));

	var a = new Api(app, config, models);
	return server;
}