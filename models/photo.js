var User = require('./user');
var Photo = function(Bookshelf) {

    return Bookshelf.PG.Model.extend({
        tableName: 'photos',

        creator: function() {
            return this.belongsTo(User(Bookshelf), 'creator');
        }

    });
}

module.exports = Photo;