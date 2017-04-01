/* Setup Item page controller */
angular.module('MetronicApp').controller('ItemController', [
	'$rootScope', 
	'$scope', 
	'settings', 
	'$log', 
	's_item',
    '$stateParams',
    '$state',
	function($rootScope, $scope, settings, $log, s_item, $stateParams, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
    $scope.fields = s_item.fields;
    $scope.item = {};
    $scope.create = function() {
        $scope.item.appp = $stateParams.appp_id;
        s_item.create($scope.item).then(function(res){
            $state.go('items_show', {workspace_id: $stateParams.workspace_id, appp_id: $stateParams.appp_id, item_id: res.data._id});
        });
    }

    $scope.newItem = function() {
        
    }
}]);
