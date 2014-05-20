var _ = require('underscore');

var debug = true;

var COMMON = {
	'port': 9000,
	'host': '0.0.0.0',



	database: {

		connection: {
			charset: 'utf8',
			database: 'catan',
			user: 'catan',
			password: 'lolwut'
		},
	},

}



var _confs = {};

_confs.DEV = {
	cookie: {
		secret: 'hahahahah'
	}
};

_confs.TEST = {
	port: 9001,
	cookie: {
		secret: 'test'
	}
};



_confs.PROD = {};


module.exports = function(program) {
	var type = program.config;
	if (!_.contains(['dev', 'prod', 'stage', 'test'], type)) {
		throw new Error('Invalid config, must be one of dev, prod, stage')
	}
	_.extend(this, COMMON, _confs[type.toUpperCase()]);

	program.port && (this.port = program.port);
	return this;
}