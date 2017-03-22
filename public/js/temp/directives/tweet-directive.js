angular.module('fb-tw-integration')
  .directive('tweet', ['manage_tw_account', function(manage_tw_account) {
    return {
      require: 'ngModel',
      scope: {
        tweet: '=ngModel'
      },
      templateUrl: 'views/partials/tweet.directive.html',
      link: function(scope, element, attributes, ngModel) {
        scope.addTweet = function(tweet, text){
          if (text != ""){
            manage_tw_account.addTweet(tweet, text);
          }
        };
        scope.account = manage_tw_account.getCurrentAccount();
      }
    };
  }]);
