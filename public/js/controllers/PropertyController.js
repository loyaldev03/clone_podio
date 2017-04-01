/* Setup Property page controller */
angular.module('MetronicApp').controller('PropertyController', [
	'$rootScope', 
	'$scope', 
	'settings', 
	'$uibModal', 
	'$log', 
	's_property',
	'$stateParams',
	'$state',
	function($rootScope, $scope, settings, $uibModal, $log, s_property, $stateParams, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
   
   	$scope.newProperty = function() {
   		$state.go('properties_new', {workspace_id: $stateParams.workspace_id});
   	}
    $scope.fields = s_property.fields;

    $scope.createProperty = function() {
      s_property.create({
      	name: $scope.property.name, 
      	item_name: $scope.property.item_name,
      	type: $scope.property.type,
      	app_icon: $scope.property.app_icon,
      	workspace: $stateParams.workspace_id
      })
      .then(function(res){
      	$state.go('properties_edit', {workspace_id: $stateParams.workspace_id, property_id: res.data._id});
      });
    }

    $scope.updateProperty = function() {
    	$state.go('properties_show', {workspace_id: $stateParams.workspace_id, property_id: $stateParams.property_id});
    }

    $scope.addItem = function() {
    	$state.go('items_new', {workspace_id: $stateParams.workspace_id, property_id: $stateParams.property_id});
    }
}]);
