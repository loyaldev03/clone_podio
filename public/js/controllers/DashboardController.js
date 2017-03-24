angular.module('MetronicApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout, statistics) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.number_of_deals = 100;
    
    console.log("-----------------statistics-----------------------", statistics.statistics);
    $scope.acc_properties_stats = statistics.statistics.acc_properties_stats
   
    $scope.tasks_due_today = statistics.statistics.tasks_due_today;

    $scope.tasks_past_due = statistics.statistics.tasks_past_due;

    $scope.work_in_progress = statistics.statistics.work_in_progress;

    $scope.properties_not_updated_in = statistics.statistics.properties_not_updated_in;
});