angular.module('fb-tw-integration')
.controller('PostCtrl', [
  '$scope',
  'page_info',
  function($scope, page_info) {
  	console.log("page info", page_info);
    $scope.page_info = page_info;
    $scope.posts = page_info.posts;
  }
]);

