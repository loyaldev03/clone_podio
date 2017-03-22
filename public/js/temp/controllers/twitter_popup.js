angular.module('fb-tw-integration')
  .controller('tweetPopupCtrl', ['manage_tw_account', '$scope', '$uibModalInstance', 'target_tweet', 'tweets', 
    function(manage_tw_account, $scope, $uibModalInstance, target_tweet, tweets) {
    
      function buildConversationTweetsForParent(conversation_tweets, target_tweet, all_tweets) {
        for (var tweet of all_tweets) {
          if (tweet.id === target_tweet.in_reply_to_status_id) {
            buildConversationTweetsForParent(conversation_tweets, tweet, all_tweets);
            conversation_tweets.push(tweet)
          }
        }
        return;
      }

      $scope.tweets = tweets;
      $scope.target_tweet = target_tweet;
      $scope.parent_tweets = [];
      buildConversationTweetsForParent($scope.parent_tweets, target_tweet, tweets);
      $scope.child_tweets = [];
      for (var c_tweet of $scope.tweets) {
        if (c_tweet.in_reply_to_status_id === $scope.target_tweet.id) {
          $scope.child_tweets.push(c_tweet);
        } 
      }
      $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.addTweet = function(tweet, text) {
        $scope.text = "";
        manage_tw_account.addTweet(tweet, text);
      }

      $scope.changeTarget = function(target_tweet) {
        $scope.target_tweet = target_tweet;
        $scope.parent_tweets = [];
        buildConversationTweetsForParent($scope.parent_tweets, $scope.target_tweet, $scope.tweets);
        $scope.child_tweets = [];
        for (var c_tweet of $scope.tweets) {
          if (c_tweet.in_reply_to_status_id === $scope.target_tweet.id) {
            $scope.child_tweets.push(c_tweet);
          } 
        }
      }
      
      $scope.$on('update_account', function(event, account_info) {
        console.log("--------notice update account-------------------");
        $scope.tweets = account_info.tweets;
        $scope.child_tweets = [];
        for (var c_tweet of $scope.tweets) {
          if (c_tweet.in_reply_to_status_id === $scope.target_tweet.id) {
            $scope.child_tweets.push(c_tweet);
          } 
        }
      })
  }]);
