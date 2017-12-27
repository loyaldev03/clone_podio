angular.module('MetronicApp')
.factory('s_auth', ['$http', '$window', function($http, $window){
	var auth = {};

	auth.saveToken = function (token) {
		$window.localStorage['current-user-token'] = token;
	}

	auth.getToken = function() {
		return $window.localStorage['current-user-token'];
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	}

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload._id;
		}
	}

	auth.register = function(user){
	  return $http.post('/api/v1/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};	

	auth.logIn = function(user){
	  return $http.post('/api/v1/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logOut = function(){
	  $window.localStorage.removeItem('current-user-token');
	};	
	
	auth.activate = function(id) {
		return $http.post('/api/v1/activate/'+id, {}).success(function(data){
			auth.saveToken(data.token);
		}).error(function(err){
			return err;
		})
	}

	auth.isActivated = function() {
		var token = auth.getToken();
		var payload = JSON.parse($window.atob(token.split('.')[1]));
		return payload.activated;
	}
	return auth;
}])
angular.module('MetronicApp')
.factory('s_auth', ['$http', '$window', function($http, $window){
	var auth = {};

	auth.saveToken = function (token) {
		$window.localStorage['current-user-token'] = token;
	}

	auth.saveToken = function (token) {
		$window.localStorage['current-user-token'] = token;
	}

	auth.getToken = function() {
		return $window.localStorage['current-user-token'];
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	}

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload._id;
		}
	}

	auth.register = function(user){
	  return $http.post('/api/v1/register', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};	

	auth.logIn = function(user){
	  return $http.post('/api/v1/login', user).success(function(data){
	    auth.saveToken(data.token);
	  });
	};

	auth.logOut = function(){
	  $window.localStorage.removeItem('current-user-token');
	};	
	
	auth.activate = function(id) {
		return $http.post('/api/v1/activate/'+id, {}).success(function(data){
			auth.saveToken(data.token);
		}).error(function(err){
			return err;
		})
	}

	auth.isActivated = function() {
		var token = auth.getToken();
		var payload = JSON.parse($window.atob(token.split('.')[1]));
		return payload.activated;
	}
	return auth;
}])
