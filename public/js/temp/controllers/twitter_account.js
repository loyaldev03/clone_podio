angular.module('fb-tw-integration')
.controller('TwitterAccountCtrl', [
  '$scope',
  'account_info',
  'manage_tw_account',
  'Socket',
  '$uibModal',
  '$rootScope',
  function($scope, account_info, manage_tw_account, Socket, $uibModal, $rootScope) {
    Socket.on('tweet.updated', function(user_id) {
      if (user_id.toString() === $scope.account_info.id) {
        manage_tw_account.getAccountInfo($scope.account_info._id).then(function(account) {
          $scope.account_info = account;
          $scope.tweets = account.tweets;
          // console.log("----------------number of tweets-------------------", $scope.tweets.length);
          $rootScope.$broadcast('update_account', account);
        })
      }
    })
    $scope.account_info = account_info;
    $scope.tweets = account_info.tweets;
    manage_tw_account.setCurrentAccount($scope.account_info);

    $scope.clickTweet = function(target_tweet) {
      $scope.conversation_tweets = [];
      var modalInstance = $uibModal.open({
        templateUrl: 'views/partials/tweet_popup.html',
        controller: 'tweetPopupCtrl',
        resolve: {
          tweets: function () {
            return $scope.tweets;
          },
          target_tweet: function () {
            return target_tweet;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function (err) {
        console.log(err);
      });
    }
  }
]);

