angular.module('MetronicApp')
.factory('workspace', [
	'$http', 
	'$window', 
	's_auth', 
	function($http, $window, s_auth){
		var workspace = {};

		workspace.create = function(workspace) {
			return $http.post('/api/v1/workspaces', workspace, {
				headers: {s_authorization: 'Bearer '+s_auth.getToken()}
			}).success(function(workspace){
						return workspace;
			})
		}
		workspace.get = function(id) {
			return $http.get('/api/v1/workspace/'+id, {
				headers: {s_authorization: 'Bearer '+s_auth.getToken()}
			}).then(function(res){
					return res.data;
			})
		}
		workspace.getAllWorkspaces = function() {
			return $http.get('/api/v1/workspaces', {
				headers: {s_authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res) {
					return res.data;
			})
		}
		return workspace;
}]);