angular.module('fb-tw-integration')
.factory('manage_fb_account', [
  '$http',
  function($http){
    var o = {
      accounts: []
    };

    o.getAllAccounts = function() {
      return $http.get('/api/v1/accounts')
              .then(function(res) {
                angular.copy(res.data, o.accounts);
              })
    };

    o.getAccountInfo = function(account_id) {
      return $http.get('/api/v1/account/' + account_id)
              .then(function(res) {
                return res.data;
              });
    };

    o.addAccount = function(account) {
      o.accounts.push(account);
    };

    o.getFullPageInfo = function(page_id) {
      return $http.get('/api/v1/full_page/' + page_id)
              .then(function(res) {
                return res.data;
              });            
    }
    o.getPageInfo = function(page_id) {
      return $http.get('/api/v1/page/' + page_id)
              .then(function(res) {
                return res.data;
              });      
    };

    o.getPostInfo = function(post_id) {
      return $http.get('/api/v1/post/' + post_id)
              .then(function(res) {
                return res.data;
              });      
    };

    o.getCommentInfo = function(comment_id) {
      return $http.get('/api/v1/comment/' + comment_id)
              .then(function(res) {
                return res.data;
              });      
    };

    o.addMention = function(comment, msg) {
      console.log(comment, msg);
      return $http.post('/api/v1/mentions', {comment_id: comment._id, msg: msg}, function(res) {
        return res.data;
      })
    }

    o.addComment = function(post, msg) {
      console.log(post, msg);
      return $http.post('/api/v1/comments', {post_id: post._id, msg: msg}, function(res) {
        return res.data;
      })
    }

    return o;
  }
])