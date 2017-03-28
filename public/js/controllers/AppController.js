angular.module('MetronicApp').controller('AppController', ['$scope', '$rootScope', 'auth', function($scope, $rootScope, auth) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });

    // $scope.isLoggedIn = auth.isLoggedIn();
    // $scope.isLoggedIn = true;
}]);