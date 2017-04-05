angular.module('MetronicApp').controller('AuthController', [
'$scope',
'$state',
's_auth',
'$location',
'$stateParams',
'$auth',
function($scope, $state, s_auth, $location, $stateParams, $auth){
  $scope.user = {};

  $scope.submitted = false;

  $scope.register = function(){
    $scope.submitted = true;
    $scope.error = "";
    if (!($scope.user.full_name && $scope.user.username && $scope.user.email && $scope.user.password)) {
      $scope.error = "Please fill out all fields for registration";
    }
    if ($scope.user.full_name && $scope.user.username && $scope.user.email && $scope.user.password) {
      s_auth.register($scope.user).error(function(error){
        $scope.error = error.message;
      }).then(function(){
        $state.go( "verify_account" );
      });
    } 
  };

  $scope.registerOrganization = function() {
    s_auth.registerOrganization($scope.user.organization).error(function(err){
      $scope.error = err.message;
    }).then(function() {
      $state.go("dashboard");
    })
  }
  
  $scope.logIn = function(){
    s_auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go( "verify_account" );
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
      });    
  };

  $scope.gotoLogin = function() {
    $state.go('login');
  }

  $scope.user = {};
  //for profile registration page with social login
  $scope.user.email = s_auth.getEmail();
}])