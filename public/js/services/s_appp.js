angular.module('MetronicApp')
.factory('s_appp', [
	'$http', 
	'$window', 
	's_auth', 
	'$http', 
	'$window', 
	's_auth', 	
	function($http, $window, s_auth){
		var appp = {
			all_appps: [],
			current_appp: {}
		};

		appp.create = function(appp) {
			return $http.post('/api/v1/appps', appp, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).success(function(appp){
						return appp;
			})
			}
		appp.get = function(id) {
			return $http.get('/api/v1/appp/'+id, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).then(function(res){
					return res.data;
			})
		}
		appp.setCurrentAppp = function(id) {
			return $http.get('/api/v1/appp/'+id, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).then(function(res){
					appp.current_appp = res.data;
					return res.data;
			})
		}
		appp.getCurrentAppp = function() {
			return appp.current_appp;
		}
		// appp.getAllAppps = function() {
		// 	return $http.get('/api/v1/appps', {
		// 		headers: {s_authorization: 'Bearer ' + s_auth.getToken()}
		// 	}).then(function(res) {
		// 			return res.data;
		// 	})
		// }
		return appp;
}]);

angular.module('MetronicApp')
.factory('s_appp', [
	'$http', 
	'$window', 
	's_auth', 
	function($http, $window, s_auth){
		var appp = {
			all_appps: [],
			current_appp: {}
		};

		appp.create = function(appp) {
			return $http.post('/api/v1/appps', appp, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).success(function(appp){
						return appp;
			})
			}
		appp.create = function(appp) {
			return $http.post('/api/v1/appps', appp, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).success(function(appp){
						return appp;
			})
			}

		appp.get = function(id) {
			return $http.get('/api/v1/appp/'+id, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).then(function(res){
					return res.data;
			})
		}
		appp.setCurrentAppp = function(id) {
			return $http.get('/api/v1/appp/'+id, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).then(function(res){
					appp.current_appp = res.data;
					return res.data;
			})
		}
		appp.getCurrentAppp = function() {
			return appp.current_appp;
		}
		// appp.getAllAppps = function() {
		// 	return $http.get('/api/v1/appps', {
		// 		headers: {s_authorization: 'Bearer ' + s_auth.getToken()}
		// 	}).then(function(res) {
		// 			return res.data;
		// 	})
		// }
		return appp;
}]);		
