define([
	'underscore',
	'backbone',
	'models/user'
], function(_, Backbone, User) {


	var Auth = function() {

	}


	Auth.prototype = {

		getUser: function() {

		},

		authorize: function(app) {
			var username = localStorage['catanUser'];
			var token = localStorage['catanToken'];
			if (!username || !token) {
				//don't even make the api call, just reject it immediately
				return $.Deferred().reject({
					simulated: true
				}).promise();
			}

			this._model = new User({
				username: username,
				auth_token: token,
			}, app);

			var self = this;
			this._model.on('sync', function() {
				self.__isAuthed = true;
			});
			return this._model.fetch();
		},

		setHeaders: function(xhr) {
			if (this._model) {
				var header = this._model.get('username') + ':' + this._model.get('auth_token');
				xhr.setRequestHeader('auth_token', header);
			}
		},

		isAuthorized: function() {
			return this.__isAuthed;
		},

		memo: function(model) {
			this._model = model;
			localStorage['catanToken'] = this._model.get('auth_token');
			localStorage['catanUser'] = this._model.get('username');
		}

	}

	return Auth;
})