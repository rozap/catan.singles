var UserResource = require('./resources/user'),
    ThreadResource = require('./resources/thread'),
    CommentResource = require('./resources/comment');

module.exports = function(app, config, models) {
    //TODO: make this nicer...so this stuff isn't in the config
    config.apiBase = '/api/v1/';
    config.models = models;
    var opts = {
        app: app,
        config: config,
    }
    new UserResource(opts);

    console.log("im an api!")
}