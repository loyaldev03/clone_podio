/* Setup Appp page controller */
angular.module('MetronicApp').controller('ApppController', [
	'$rootScope', 
	'$scope', 
	'settings', 
	'$uibModal', 
	'$log', 
	's_appp',
	'$stateParams',
	'$state',
	function($rootScope, $scope, settings, $uibModal, $log, s_appp, $stateParams, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
   
    $scope.current_appp = s_appp.getCurrentAppp();
    
    $scope.createAppp = function() {
      s_appp.create({
      	name: $scope.appp.name, 
      	item_name: $scope.appp.item_name,
      	type: $scope.appp.type,
      	app_icon: $scope.appp.app_icon,
      	workspace: $stateParams.workspace_id
      })
      .then(function(res){
      	$state.go('appps_edit', {workspace_id: $stateParams.workspace_id, appp_id: res.data._id});
      });
      s_appp.create({
      	name: $scope.appp.name, 
      	item_name: $scope.appp.item_name,
      	type: $scope.appp.type,
      	app_icon: $scope.appp.app_icon,
      	workspace: $stateParams.workspace_id
      })
      .then(function(res){
      	$state.go('appps_edit', {workspace_id: $stateParams.workspace_id, appp_id: res.data._id});
      });	    
    }

    $scope.updateAppp = function() {
    	$state.go('appps_show', {workspace_id: $stateParams.workspace_id, appp_id: $stateParams.appp_id});
    }

    $scope.addItem = function() {
    	$state.go('items_new', {workspace_id: $stateParams.workspace_id, appp_id: $stateParams.appp_id});
    }
}]);

angular.module('MetronicApp').controller('ApppModalDialogHelperController', [
	'$rootScope', 
	'$scope', 
	'settings', 
	'$uibModal', 
	'$log', 
	's_appp',
	'$state',
	function($rootScope, $scope, settings, $uibModal, $log, s_appp, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    // All Appps
    // Modal Dialog for creating appp
		$scope.animationsEnabled = true;
		$scope.addAppp = function(opt_attributes)
		{
		    var out = $uibModal.open(
		    {
		        animation: $scope.animationsEnabled,
		        templateUrl: "views/appps/select_appp.html",
		        controller: "SelectApppModalController",
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
		$scope.goto = function(appp) {
	      $state.go('appps_detail', {id: appp._id});
		}
}]);


angular.module('MetronicApp').controller('ApppModalDialogHelperController', [
	'$rootScope', 
	'$scope', 
	'settings', 
	'$uibModal', 
	'$log', 
	's_appp',
	'$state',
	function($rootScope, $scope, settings, $uibModal, $log, s_appp, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });

    // All Appps
    // Modal Dialog for creating appp
		$scope.animationsEnabled = true;
		$scope.addAppp = function(opt_attributes)
		{
		    var out = $uibModal.open(
		    {
		        animation: $scope.animationsEnabled,
		        templateUrl: "views/appps/select_appp.html",
		        controller: "SelectApppModalController",
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
		$scope.goto = function(appp) {
	      $state.go('appps_detail', {id: appp._id});
		}
}]);

angular.module('MetronicApp').controller('SelectApppModalController', [
		'$scope', 
		'$uibModalInstance', 
		's_appp', 
		's_auth', 
		'$state', 
		'$location',
		's_workspace',
		function($scope, $uibModalInstance, s_appp, s_auth, $state, $location, s_workspace) {
    $scope.newApp = function() {
		  $uibModalInstance.close();
    	$state.go('appps_new', {workspace_id: s_workspace.current_workspace._id})
    }

    $scope.addAppFromMarket = function() {
    	console.log("----------------add app------------------------");
    }
}]);

