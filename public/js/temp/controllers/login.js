angular.module('fb-tw-integration')
.controller('LoginCtrl', [
  '$scope',
  '$state',
  '$auth',
  'manage_fb_account',
  'manage_tw_account',
  function($scope, $state, $auth, manage_fb_account, manage_tw_account) {
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
      .then(function(res){
        if (provider === 'facebook') {
          if (res.data.error) {
            alert(res.data.error);
          } else {
            manage_fb_account.addAccount(res.data);
            $scope.accounts = manage_fb_account.accounts;
            console.log("--------------scope account-----------------", $scope.accounts);
          }          
        }
        if (provider === 'twitter') {
          if (res.data.error) {
            alert(res.data.error);
          } else {
            manage_tw_account.addAccount(res.data);
            $scope.twitter_accounts = manage_tw_account.accounts;
          }          
        }
      });
    }

    $scope.accounts = manage_fb_account.accounts;
    $scope.tweet_accounts = manage_tw_account.accounts;
  }
]);

