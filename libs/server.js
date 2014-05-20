var express = require('express'),
	expressValidator = require("express-validator"),
	session = require("express-session"),
	nunjucks = require('nunjucks'),
	Api = require('./api'),
	Controllers = require('./controllers')


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


		var up = '..' + __dirname;
		console.log(up + '/public/static')
		app.use('/static', express.static(__dirname + '/../public/static'));

		new Api(app, config, models);
		new Controllers(app, config, models);
		return server;
	}