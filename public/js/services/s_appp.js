angular.module('MetronicApp')
.factory('s_appp', [
	'$http', 
	'$window', 
	's_auth', 
	function($http, $window, s_auth){
		var appp = {
			all_appps: []
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
		// appp.getAllAppps = function() {
		// 	return $http.get('/api/v1/appps', {
		// 		headers: {s_authorization: 'Bearer ' + s_auth.getToken()}
		// 	}).then(function(res) {
		// 			return res.data;
		// 	})
		// }
		return appp;
}]);