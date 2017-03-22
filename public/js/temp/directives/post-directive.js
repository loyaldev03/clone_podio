angular.module('fb-tw-integration')
  .directive('post', ['manage_fb_account', function(manage_fb_account) {
    return {
      require: 'ngModel',
      scope: {
        post: '=ngModel'
      },
      templateUrl: 'views/partials/post.directive.html',
      link: function(scope, element, attributes, ngModel) {
        scope.addMention = function(comment, new_mention){
          if (new_mention != ""){
            manage_fb_account.addMention(comment, new_mention);
          }
        };

        scope.addComment = function(post, new_comment) {
          if (new_comment != "") {
            manage_fb_account.addComment(post, new_comment);
          }
        };
      }
    };
  }]);
