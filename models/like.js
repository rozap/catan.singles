var User = require('./user');
var Like = function(Bookshelf) {

    return Bookshelf.PG.Model.extend({
        tableName: 'likes',


        liker: function() {
            return this.belongsTo(User(Bookshelf), 'liker');
        },

        liker: function() {
            return this.belongsTo(User(Bookshelf), 'likee');
        }

    });
}

module.exports = Like;