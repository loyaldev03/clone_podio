angular.module('fb-tw-integration')
  .directive('tweetBlock', ['manage_tw_account', function(manage_tw_account) {
    return {
      scope: {
        target_tweet: '=targetTweet',
        tweets: '=tweets',
        changeTargetFunctionForParent: '=changeTarget'
      },
      templateUrl: 'views/partials/tweet_block.directive.html',
      link: function(scope, element, attributes, ngModel) {
        function buildConversationTweetsForChild(conversation_tweets, target_tweet, all_tweets) {
          var temp_tweet;
          for (var tweet of all_tweets) {
            if (tweet.in_reply_to_status_id === target_tweet.id) {
              if (!temp_tweet) {
                temp_tweet = tweet;
              } else {
                if (temp_tweet.created_at > tweet.created_at) {
                  temp_tweet = tweet;
                }
              }
            }
          }
          if (temp_tweet) {
              buildConversationTweetsForChild(conversation_tweets, temp_tweet, all_tweets);
              conversation_tweets.push(temp_tweet)
          }
        }
        scope.conversation_tweets = [];
        buildConversationTweetsForChild(scope.conversation_tweets, scope.target_tweet, scope.tweets);
        scope.conversation_tweets = scope.conversation_tweets.reverse();
        scope.conversation_tweets.splice(0, 0, scope.target_tweet);
        scope.changeTarget = function(target_tweet) {
          scope.changeTargetFunctionForParent(target_tweet);
        }
      }
    };
  }]);
