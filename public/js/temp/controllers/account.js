angular.module('fb-tw-integration')
.controller('AccountCtrl', [
  '$scope',
  'account_info',
  'manage_fb_account',
  'Socket',
  function($scope, account_info, manage_fb_account, Socket) {
    Socket.on('page.updated', function(page_id) {
      if ($scope.full_page_info && $scope.full_page_info.id === page_id) {
        return manage_fb_account.getFullPageInfo($scope.full_page_info._id).then(function(data){
              $scope.full_page_info = data;
              $scope.posts = data.posts;
            });     
      }
    })
    $scope.account_info = account_info;
    $scope.pages = account_info.pages;
    if (account_info.pages.length > 0) {
      manage_fb_account.getFullPageInfo($scope.pages[0]._id).then(function(data){
        $scope.full_page_info = data;
        $scope.posts = data.posts;
      });
      $scope.changePage = function() {
        manage_fb_account.getFullPageInfo($scope.selectedPage._id).then(function(data){
          $scope.full_page_info = data;
          $scope.posts = data.posts;
        });
      }      
    }
  }
]);

