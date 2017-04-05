/* Setup Workspace page controller */
angular.module('MetronicApp').controller('WorkspaceController', [
	'$rootScope', 
	'$scope', 
	'settings', 
	'$uibModal', 
	'$log', 
	's_workspace',
	'$stateParams',
	'$state',
	function($rootScope, $scope, settings, $uibModal, $log, s_workspace, $stateParams, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    $scope.current_workspace = s_workspace.getCurrentWorkspace();
    $rootScope.current_workspace = s_workspace.getCurrentWorkspace();
    s_workspace.current_workspace = s_workspace.getCurrentWorkspace();
    
    $scope.all_workspaces = function() {
    	return s_workspace.getAllWorkspaces();
    }

    $scope.remove = function(workspace_id) {
    	s_workspace.remove(workspace_id);
    }

    $scope.update = function(workspace) {
    	s_workspace.update(workspace);
    }

    $scope.edit = function(workspace_id) {
    	s_workspace.setEditWorkspace(workspace_id).then(function(res) {
				var out = $uibModal.open(
	      {
	          animation: $scope.animationsEnabled,
	          templateUrl: "views/workspaces/edit.html",
	          controller: "CreateWorkspaceModalController",
	          size: "",
	          resolve: {
	          }
	      });
	      out.result.then(function(value)
	      {
	          $scope.selected = value;
	      }, function()
	      {
	          console.log("Modal dismissed at: " + new Date);
	      });    	    		
    	});
    }
    $scope.propertyIndex = function() {
        $state.go('properties_index', {workspace_id: $stateParams.id});
    }
    $scope.newAppp = function() {
        $state.go('appps_new', {workspace_id: $stateParams.id});
    }    
}]);

angular.module('MetronicApp').controller('WorkspaceModalDialogHelperController', [
	'$rootScope', 
	'$scope', 
	'settings', 
	'$uibModal', 
	'$log', 
	's_workspace',
	'$state',
	function($rootScope, $scope, settings, $uibModal, $log, s_workspace, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    if (s_workspace.all_workspaces.length == 0)
    {
    	s_workspace.getAllWorkspaces().then(function(data){
				$scope.workspaces_list = data;
	    })
	  } else {
	  	$scope.workspaces_list = s_workspace.all_workspaces;
	  }
    // All Workspaces
    // Modal Dialog for creating workspace
		$scope.animationsEnabled = true;
		$scope.open = function(opt_attributes)
		{
		    var out = $uibModal.open(
		    {
		        animation: $scope.animationsEnabled,
		        templateUrl: "views/workspaces/new.html",
		        controller: "CreateWorkspaceModalController",
		        size: opt_attributes,
		        resolve: {
		        }
		    });
		    out.result.then(function(value)
		    {
		        $scope.selected = value;
		    }, function()
		    {
		        $log.info("Modal dismissed at: " + new Date);
		    });
		};
		$scope.toggleAnimation = function()
		{
		    $scope.animationsEnabled = !$scope.animationsEnabled;
		};
		$scope.goto = function(workspace) {
	      $state.go('workspaces_show', {id: workspace._id});
		}
}]);

angular.module('MetronicApp').controller('CreateWorkspaceModalController', [
		'$scope', 
		'$uibModalInstance', 
		's_workspace', 
		's_auth', 
		'$state', 
		'$location',
		function($scope, $uibModalInstance, s_workspace, s_auth, $state, $location) {
    $scope.createWorkspace = function()
    {
    	$scope.workspace.user = s_auth.currentUser();
      s_workspace.create($scope.workspace)
      .then(function(res){
	      $uibModalInstance.close();
      	$state.go('workspaces_show', {id: res.data._id});
      });
    };
    $scope.cancel = function()
    {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.edit_workspace = s_workspace.getEditWorkspace();

    $scope.updateWorkspace = function() {
    	s_workspace.update($scope.edit_workspace).then(function(res){
	      $uibModalInstance.close();
    	});
    }
}]);