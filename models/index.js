var Bookshelf = require('bookshelf'),
    Promise = require('bluebird'),
    crypto = require('crypto'),
    bcrypt = require('bcrypt'),
    _ = require('underscore');


module.exports = function(config) {

    Bookshelf.PG = Bookshelf.initialize({
        client: 'pg',
        connection: {
            host: config.database.connection.host,
            user: config.database.connection.user,
            password: config.database.connection.password,
            database: config.database.connection.database,
            charset: config.database.connection.charset
        }
    });


    return {
        'Bookshelf': Bookshelf,
        'User': require('./user')(Bookshelf),
        'Meetup': require('./meetup')(Bookshelf),
        'Photo': require('./photo')(Bookshelf),
        'Like': require('./like')(Bookshelf),
        'Invite': require('./invite')(Bookshelf),
        'Conversation': require('./conversation')(Bookshelf),
    }
}