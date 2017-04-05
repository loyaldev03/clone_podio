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
   	//Fields for property
    $scope.fields = s_property.fields;

    $scope.property = {};
    $scope.createProperty = function() {
      s_property.create($scope.property, $stateParams.workspace_id).then(function(res){
        $state.go('properties_index', {workspace_id: $stateParams.workspace_id});
      });
    }

    //All Properties for workspace
    $scope.properties = s_property.properties;
    $scope.property = s_property.current_property;
    $scope.updateProperty = function() {
    	$state.go('properties_show', {workspace_id: $stateParams.workspace_id, property_id: $stateParams.property_id});
    }

    $scope.addproperty = function() {
      s_property.initializeCurrentProperty();        
    	$state.go('properties_new', {workspace_id: $stateParams.workspace_id});
    }

    //edit, remove property
    $scope.remove = function(property_id) {
      s_property.remove(property_id, $stateParams.workspace_id).then(function(res){
        s_property.getProperties($stateParams.workspace_id).then(function(properties){
          $scope.properties = s_property.properties;
          $state.go('properties_index', {workspace_id: $stateParams.workspace_id});
        });        
      });
    }

    $scope.update = function() {
      s_property.update($scope.property).then(function(res){
        $state.go('properties_index', {workspace_id: $stateParams.workspace_id});
      });
    }

    $scope.edit = function(property_id) {
      $state.go('properties_edit', {workspace_id: $stateParams.workspace_id, property_id: property_id});
    }    
}]);
