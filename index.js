#!/usr/bin/env node

var program = require('commander'),
	server = require('./libs/server'),
	Models = require('./models/index'),
	Config = require('./config/config');


program
	.version('0.0.0')
	.option('-p, --port [n]', 'Run the websocket on the specified port', parseInt)
	.option('-c --config [type]', 'Load the config settings [dev, prod, stage]')
	.parse(process.argv);


var conf = new Config(program);
var models = new Models(conf);
server(conf, models);