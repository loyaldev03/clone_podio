angular.module('fb-tw-integration')
.controller('PageCtrl', [
  '$scope',
  'full_page_info',
  'manage_fb_account',
  function($scope, full_page_info, manage_fb_account) {
  	console.log("page info", full_page_info);
    $scope.full_page_info = full_page_info;
    $scope.posts = full_page_info.posts;
  }
]);

