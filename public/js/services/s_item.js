angular.module('MetronicApp')
.factory('s_item', [
	'$http', 
	'$window', 
	's_auth', 
	function($http, $window, s_auth){
		var service = {
			fields: [],
		};

		service.getFields = function(appp_id) {
			return $http.get('/api/v1/fields/get_fields/'+appp_id, {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res){
				service.fields = res.data; 
				return res.data;
			})
		}
		
		service.create = function(item) {
			return $http.post('/api/v1/items', item, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).success(function(item){
						return item;
			})			
		}

		service.getPropertyFields = function() {
			return $http.get('/api/v1/fields/get_property_fields/',{
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res) {

			})	
		}
		// item.create = function(item) {
		// 	return $http.post('/api/v1/items', item, {
		// 		headers: {s_authorization: 'Bearer '+s_auth.getToken()}
		// 	}).success(function(item){
		// 				return item;
		// 	})
		// }
		// item.get = function(id) {
		// 	return $http.get('/api/v1/item/'+id, {
		// 		headers: {s_authorization: 'Bearer '+s_auth.getToken()}
		// 	}).then(function(res){
		// 			return res.data;
		// 	})
		// }
		// item.getAllItems = function() {
		// 	return $http.get('/api/v1/items', {
		// 		headers: {s_authorization: 'Bearer ' + s_auth.getToken()}
		// 	}).then(function(res) {
		// 			return res.data;
		// 	})
		// }
		return service;
}]);