angular.module('MetronicApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.number_of_deals = 100;
    
    $scope.acc_properties_stats = {
    	number_of_deals: 100,
    	number_of_active_deals: 50,
    	number_of_under_contracts: 50,
    	number_of_offers_made: 10,
    	number_of_closed_deals: 10,
    	number_of_offers_accepted: 20,
    	number_of_work_in_progress: 10,
    	number_of_tasks_past_due: 50,
    	number_of_tasks_due_today: 50
    }

    $scope.tasks_due_today = [
    	{task_name: "first_task", workspace_name: "first_workspace"},
    	{task_name: "second_task", workspace_name: "second_workspace"},
    	{task_name: "third_task", workspace_name: "third_workspace"},
    	{task_name: "fourth_task", workspace_name: "fourth_workspace"},
    	{task_name: "fifth_task", workspace_name: "fifth_workspace"}
    ];

    $scope.tasks_past_due = [
    	{task_name: "first_task", workspace_name: "first_workspace", due_date: "3-3-2016"},
    	{task_name: "second_task", workspace_name: "second_workspace", due_date: "5-5-2016"},
    	{task_name: "third_task", workspace_name: "third_workspace", due_date: "1-6-2016"},
    	{task_name: "fourth_task", workspace_name: "fourth_workspace", due_date: "4-5-2016"},
    	{task_name: "fifth_task", workspace_name: "fifth_workspace", due_date: "8-1-2016"}
    ];

});