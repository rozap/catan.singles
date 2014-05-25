define([
	'underscore',
	'backbone',
	'models/user'
], function(_, Backbone, User) {


	var Auth = function() {

	}

	Auth.user = 'catanUser';
	Auth.token = 'catanToken';


	Auth.prototype = {



		getUser: function() {

		},

		authorize: function(app) {
			var username = localStorage[Auth.user];
			var token = localStorage[Auth.token];
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
				self.app.dispatcher.trigger('authorized', self._model);
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
			localStorage[Auth.token] = this._model.get('auth_token');
			localStorage[Auth.user] = this._model.get('username');
		},

		logout: function() {
			this._model = null;
			localStorage[Auth.token] = null;
			localStorage[Auth.user] = null;
		}

	}

	return Auth;
})