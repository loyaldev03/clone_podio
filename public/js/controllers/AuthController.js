angular.module('MetronicApp').controller('AuthController', [
'$scope',
'$state',
's_auth',
'$location',
'$stateParams',
'$auth',
function($scope, $state, s_auth, $location, $stateParams, $auth){
  $scope.user = {};

  $scope.register = function(){
    s_auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go( "dashboard" );
    });
  };

  $scope.logIn = function(){
    s_auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go( "dashboard" );
    });
  };

  $scope.logOut = function() {
    s_auth.logOut($scope.user).error(function(error){
      $scope.error = error;
    }).then(function() {
      $state.go( "login" );
    })
  }

  $scope.createAccount = function() {
    $state.go('register');
  }
  
  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function(access_token) {
        console.log('You have successfully signed in with ' + provider + '!' + access_token);
        $location.path('/');
      })
      .catch(function(error) {
        console.log("---------------------error--------------------", error);
        // if (error.message) {
        //   // Satellizer promise reject error.
        //   toastr.error(error.message);
        // } else if (error.data) {
        //   // HTTP response error from server
        //   toastr.error(error.data.message, error.status);
        // } else {
        //   toastr.error(error);
        // }
      });    
  };

  $scope.createAccount = function() {
    $state.go('register');
  }
  
  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function(access_token) {
        console.log('You have successfully signed in with ' + provider + '!' + access_token);
        $location.path('/');
      })
      .catch(function(error) {
        console.log("---------------------error--------------------", error);
        // if (error.message) {
        //   // Satellizer promise reject error.
        //   toastr.error(error.message);
        // } else if (error.data) {
        //   // HTTP response error from server
        //   toastr.error(error.data.message, error.status);
        // } else {
        //   toastr.error(error);
        // }
      });    
  };  
}])
angular.module('MetronicApp').controller('AuthController', [
'$scope',
'$state',
's_auth',
'$location',
'$stateParams',
'$auth',
function($scope, $state, s_auth, $location, $stateParams, $auth){
  $scope.user = {};

  $scope.register = function(){
    s_auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go( "dashboard" );
    });
  };

  $scope.register = function(){
    s_auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go( "dashboard" );
    });
  };
  $scope.logIn = function(){
    s_auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go( "dashboard" );
    });
  };

  $scope.logOut = function() {
    s_auth.logOut($scope.user).error(function(error){
      $scope.error = error;
    }).then(function() {
      $state.go( "login" );
    })
  }

  $scope.createAccount = function() {
    $state.go('register');
  }
  
  $scope.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function(access_token) {
        console.log('You have successfully signed in with ' + provider + '!' + access_token);
        $location.path('/');
      })
      .catch(function(error) {
        console.log("---------------------error--------------------", error);
        // if (error.message) {
        //   // Satellizer promise reject error.
        //   toastr.error(error.message);
        // } else if (error.data) {
        //   // HTTP response error from server
        //   toastr.error(error.data.message, error.status);
        // } else {
        //   toastr.error(error);
        // }
      });    
  };
}])     
