var User = require('./user');

var Conversation = function(Bookshelf) {

    return Bookshelf.PG.Model.extend({

        tableName: 'conversations',
        hasTimestamps: true,

        creator: function() {
            return this.belongsTo(User(Bookshelf), 'creator');
        },

        other_user: function() {
            return this.belongsTo(User(Bookshelf), 'other_user');
        }

    });
};

module.exports = Conversation;