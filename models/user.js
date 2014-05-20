var Promise = require('bluebird'),
    crypto = require('crypto'),
    Bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 5;

var User = function(Bookshelf) {

    return Bookshelf.PG.Model.extend({

        tableName: 'users',
        hasTimestamps: true,

        constructor: function() {
            Bookshelf.PG.Model.apply(this, arguments);
            this.on('saving', this.beforeSave);
        },

        beforeSave: function(model, options) {
            var ctx = this;
            var resolver = Promise.pending();
            Bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                if (err) return resolver.reject(err);
                Bcrypt.hash(ctx.get("password"), salt, function(err, hash) {
                    if (err) return resolver.reject(err);
                    ctx.set("password", hash);
                    resolver.resolve(ctx);
                });
            });

            return resolver.promise;

        },

        validatePassword: function(guess, cb) {
            Bcrypt.compare(guess, this.get("password"), function(err, isMatch) {
                if (err) return cb(err);
                cb(null, isMatch);
            });
        }
    }, {
        randomToken: function() {
            return crypto.randomBytes(64).toString('hex');
        },


    });
};

module.exports = User;