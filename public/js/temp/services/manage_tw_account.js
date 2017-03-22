angular.module('fb-tw-integration')
.factory('manage_tw_account', [
  '$http',
  function($http){
    var o = {
      accounts: [],
      current_account: {}
    };

    o.getAllAccounts = function() {
      return $http.get('/api/v1/tweet_accounts')
              .then(function(res) {
                angular.copy(res.data, o.accounts);
              })
    };

    o.getAccountInfo = function(account_id) {
      console.log("---------------account id-------------------", account_id);
      return $http.get('/api/v1/tweet_account/' + account_id)
              .then(function(res) {
                return res.data;
              });
    };

    o.addAccount = function(account) {
      o.accounts.push(account);
    };

    o.setCurrentAccount = function(account) {
      angular.copy(account, o.current_account);
    };

    o.getCurrentAccount = function() {
      return o.current_account;
    }

    o.addTweet = function(target_tweet, text) {
      return $http.post('/api/v1/tweets', {tweet: target_tweet, text: text})
        .then(function(res) {
          return res.data;
        })
    }

    return o;
  }
])