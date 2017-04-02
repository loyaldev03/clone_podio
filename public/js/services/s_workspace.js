angular.module('MetronicApp')
.factory('s_workspace', [
	'$http', 
	'$window', 
	's_auth',
	function($http, $window, s_auth){
		var service = {
			all_workspaces: [],
			current_workspace: {}
		};

		service.create = function(workspace) {
			return $http.post('/api/v1/workspaces', workspace, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).success(function(workspace){
				service.all_workspaces.push(workspace);
				return workspace;
			})
		}
		service.get = function(id) {
			return $http.get('/api/v1/workspace/'+id, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).then(function(res){
					return res.data;
			})
		}
		service.initializeAllWorkspaces = function() {
			return $http.get('/api/v1/workspaces', {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res) {
					service.all_workspaces = res.data;
					return res.data;
			})
		}
		service.getAllWorkspaces = function() {
			return service.all_workspaces;
		}
		service.initializeAllWorkspaces();
		return service;
}]);