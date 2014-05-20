define(['views/abstract'], function(Views) {

	var LoginView = Views.AbstractView.extend({

		initialize: function(app) {
			console.log('im the login view')
		}

	})


	return LoginView

})