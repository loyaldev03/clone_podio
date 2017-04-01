/* Setup Workspace page controller */
angular.module('MetronicApp').controller('WorkspaceController', [
	'$rootScope', 
	'$scope', 
	'settings', 
	'$uibModal', 
	'$log', 
	'current_workspace',
	's_workspace',
	function($rootScope, $scope, settings, $uibModal, $log, current_workspace, s_workspace) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    $scope.current_workspace = current_workspace;
    $rootScope.current_workspace = current_workspace;
    s_workspace.current_workspace = current_workspace;
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
		'auth', 
		'$state', 
		'$location',
		function($scope, $uibModalInstance, s_workspace, auth, $state, $location) {
    $scope.createWorkspace = function()
    {
      s_workspace.create({
      	title: $scope.workspace.title, 
      	access: $scope.workspace.access, 
      	user: auth.currentUser()})
      .then(function(res){
	      s_workspace.getAllWorkspaces().then(function(data){
		      $uibModalInstance.close();
	      	$state.go('workspaces_show', {id: res.data._id});
	      })
      });
    };
    $scope.cancel = function()
    {
      $uibModalInstance.dismiss('cancel');
    };

}]);