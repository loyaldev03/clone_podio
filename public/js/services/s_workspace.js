angular.module('MetronicApp')
.factory('s_workspace', [
	'$http', 
	'$window', 
	's_auth',
	function($http, $window, s_auth){
		var service = {
			all_workspaces: [],
			current_workspace: {},
			edit_workspace: ""
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

		service.setCurrentWorkspace = function(id) {
			return $http.get('/api/v1/workspace/'+id, {
				headers: {Authorization: 'Bearer '+s_auth.getToken()}
			}).then(function(res){
					service.current_workspace = res.data;
					return res.data;
			})
		}

		service.getCurrentWorkspace = function() {
			return service.current_workspace;
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

		service.remove = function(workspace_id) {
			return $http.delete('api/v1/workspace/'+workspace_id, {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res){
				service.initializeAllWorkspaces().then(function(_res){
					return res;
				});
			});
		}

		service.update = function(workspace) {
			return $http.put('api/v1/workspace/'+workspace._id, workspace, {
				headers: {Authorization: 'Bearer ' + s_auth.getToken()}
			}).then(function(res){
				service.initializeAllWorkspaces().then(function(_res){
					return res;
				});
			});
		}

		service.setEditWorkspace = function(workspace_id) {
			return service.get(workspace_id).then(function(workspace){
				service.edit_workspace = workspace;
			})
		}

		service.getEditWorkspace = function() {
			return service.edit_workspace;
		}
		service.initializeAllWorkspaces();
		return service;
}]);