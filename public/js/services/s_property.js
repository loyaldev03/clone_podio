angular.module('MetronicApp')
.factory('s_property', [
	'$http', 
	'$window', 
	's_auth', 
	function($http, $window, s_auth){
		var service = {
			fields: [],
			properties: [],
		};

		service.getFields = function(appp_id) {
			return $http.get('/api/v1/fields/get_fields/'+appp_id, {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res){
				service.fields = res.data; 
				return res.data;
			})
		}

		service.getPropertyFields = function(workspace_id) {
			return $http.get('/api/v1/fields/get_property_fields/'+workspace_id,{
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res) {
				service.fields = res.data;
				return res.data;	
			})	
		}

		service.getPropertyFieldsForDefaultWorkspace = function() {
			return $http.get('/api/v1/fields/get_property_fields_for_default_workspace/',{
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res) {
				service.fields = res.data;
				return res.data;	
			})	
		}
		service.create = function(property, workspace_id) {
			return $http.post('/api/v1/workspaces/' + workspace_id + '/properties', property, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).success(function(property){
						return property;
			})
		}

		service.getPropertiesForWorkspace = function(workspace_id) {
			return $http.get('/api/v1/workspaces/' + workspace_id + '/properties', {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).success(function(properties) {
				service.properties = properties;
				return properties;
			})
		}
		// service.get = function(id) {
		// 	return $http.get('/api/v1/item/'+id, {
		// 		headers: {s_authorization: 'Bearer '+s_auth.getToken()}
		// 	}).then(function(res){
		// 			return res.data;
		// 	})
		// }
		// service.getAllItems = function() {
		// 	return $http.get('/api/v1/items', {
		// 		headers: {s_authorization: 'Bearer ' + s_auth.getToken()}
		// 	}).then(function(res) {
		// 			return res.data;
		// 	})
		// }
		return service;
}]);