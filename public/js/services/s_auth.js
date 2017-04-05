angular.module('MetronicApp')
.factory('s_auth', ['$http', '$window', function($http, $window){
	var service = {
			email: "",
			twitter_id: ""
	};

	service.setToken = function (token) {
		$window.localStorage['current-user-token'] = token;
	}

	service.getToken = function() {
		return $window.localStorage['current-user-token'];
	}

	service.isLoggedIn = function() {
		var token = service.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	}

	service.isOrganized = function() {
		var token = service.getToken();
		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			if (payload.organization) {
				return true;
			}
		}
		return false;
	}

	service.currentUser = function() {
		if (service.isLoggedIn()) {
			var token = service.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload._id;
		}
	}

	service.register = function(user){
	  return $http.post('/api/v1/register', {user: user, twitter_id: service.twitter_id}).success(function(data){
	    service.setToken(data.token);
	  });			
	};	

	service.registerOrganization = function(organization) {
		return $http.post('/api/v1/register_organization', {organization: organization}, {
			headers: {Authorization: 'Bearer ' + service.getToken()}
		}).success(function(data) {
			service.setToken(data.token);
		}).error(function(err){
			return err;
		})
	}

	service.logIn = function(user){
	  return $http.post('/api/v1/login', user).success(function(data){
	    service.setToken(data.token);
	  });
	};

	service.logOut = function(){
	  $window.localStorage.removeItem('current-user-token');
	};	
	
	service.activate = function(email, token) {
		return $http.post('/api/v1/activate/'+email+'/'+token, {}).success(function(data){
			service.setToken(data.token);
		}).error(function(err){
			return err;
		})
	}

	service.isActivated = function() {
		var token = service.getToken();
		var payload = JSON.parse($window.atob(token.split('.')[1]));
		return payload.activated;
	}

	service.setEmail = function(email) {
		service.email = email;
	}
	
	service.getEmail = function() {
		return service.email;
	}	

	service.setTwitterID = function(id) {
		service.twitter_id = id;
	}
	
	service.getTwitterID = function() {
		return service.twitter_id;
	}	

	return service;
}])