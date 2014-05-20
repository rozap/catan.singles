var User = require('./user');
var Meetup = function(Bookshelf) {

	return Bookshelf.PG.Model.extend({
		tableName: 'meetups',

		user: function() {
			return this.belongsTo(User(Bookshelf));
		}

	});
}



module.exports = Meetup;