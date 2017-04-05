angular.module('MetronicApp')
.factory('s_property', [
	'$http', 
	'$window', 
	's_auth', 
	function($http, $window, s_auth){
		var service = {
			fields: [],
			properties: [],
			current_property: {}
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

		service.initializeCurrentProperty = function() {
			service.current_property = {};
		}
		service.getProperties = function(workspace_id) {
			return $http.get('/api/v1/properties/' + workspace_id, {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).success(function(properties) {
				service.properties = properties;
				return properties;
			})
		}

		service.getProperty = function(property_id){
			return $http.get('/api/v1/property/' + property_id, {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res){
				service.current_property = res.data;
				return res.data;
			})
		}
		service.create = function(property, workspace_id) {
			property.workspace = workspace_id;
			return $http.post('/api/v1/properties/', property, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).success(function(property){
						return property;
			})
		}
		service.remove = function(property_id) {
			return $http.delete('api/v1/property/'+property_id, {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res){
				return res;
			});
		}

		service.update = function(property) {
			return $http.put('api/v1/property/'+property._id, property, {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res){
					return res;
			});
		}
		return service;
}]);