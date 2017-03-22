var app = angular.module('fb-tw-integration', ['ui.router', 'satellizer', 'btford.socket-io', 'ui.bootstrap'])
.config([
  '$authProvider',
  function($authProvider) {
    $authProvider.facebook({
      // clientId: '649277678594701',
      clientId: '393135537721682',
      url: '/auth/facebook',
      scope: ['manage_pages', 'publish_actions'],
    });
    $authProvider.twitter({
      url: '/auth/twitter',
      redirectUri: window.location.origin,
      popupOptions: { width: 495, height: 645 }    
    });
  }
])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider  , $urlRouterProvider) {
    $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/partials/login.html',
      controller: 'LoginCtrl',
      resolve: {
        accountsPromise: ['manage_fb_account', function(manage_fb_account) {
          return manage_fb_account.getAllAccounts();
        }],
        twitterAccountsPromise: ['manage_tw_account', function(manage_tw_account) {
          return manage_tw_account.getAllAccounts();
        }]
      }
    })
    .state('account', {
      url: '/account/{account_id}',
      templateUrl: 'views/partials/account.html',
      controller: 'AccountCtrl',
      resolve: {
        account_info: ['$stateParams', 'manage_fb_account', function($stateParams, manage_fb_account) {
          return manage_fb_account.getAccountInfo($stateParams.account_id);
        }]
      }
    })
    .state('page', {
      url: '/page/{page_id}',
      templateUrl: 'views/partials/page.html',
      controller: 'PageCtrl',
      resolve: {
        full_page_info: ['$stateParams', 'manage_fb_account', function($stateParams, manage_fb_account) {
          // return manage_fb_account.getFullPageInfo($stateParams.page_id);
        }]
      }
    })
    .state('tweet_account', {
      url: '/tweet_account/{account_id}',
      templateUrl: 'views/partials/twitter_account.html',
      controller: 'TwitterAccountCtrl',
      resolve: {
        account_info: ['$stateParams', 'manage_tw_account', function($stateParams, manage_tw_account) {
          return manage_tw_account.getAccountInfo($stateParams.account_id);
        }]
      }
    })    
    $urlRouterProvider.otherwise('login');
  }
]);