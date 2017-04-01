angular.module('MetronicApp')
.factory('s_workspace', [
	'$http', 
	'$window', 
	's_auth',
	function($http, $window, s_auth){
		var workspace = {
			all_workspaces: [],
			current_workspace: {}
		};

		workspace.create = function(workspace) {
			return $http.post('/api/v1/workspaces', workspace, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).success(function(workspace){
						return workspace;
			})
		}
		workspace.get = function(id) {
			return $http.get('/api/v1/workspace/'+id, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).then(function(res){
					return res.data;
			})
		}
		workspace.getAllWorkspaces = function() {
			return $http.get('/api/v1/workspaces', {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res) {
					workspace.all_workspaces = res.data;
					return res.data;
			})
		}
		workspace.getAllWorkspaces();
		return workspace;
}]);