var User = require('../models/user');


var Invite = function(Bookshelf) {

    return Bookshelf.PG.Model.extend({
        tableName: 'invites',

        invitee: function() {
            return this.hasOne(User(Bookshelf), 'invitee');
        },

        creator: function() {
            return this.belongsTo(User(Bookshelf), 'creator');
        }

    });
}

module.exports = Invite;