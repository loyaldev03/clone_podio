angular.module('MetronicApp').controller('AuthCtrl', [
'$scope',
'$state',
'auth',
'$location',
function($scope, $state, auth, $location){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go( "dashboard" );
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go( "dashboard" );
    });
  };

  $scope.logOut = function() {
    auth.logOut($scope.user).error(function(error){
      $scope.error = error;
    }).then(function() {
      $state.go( "login" );
    })
  }

  $scope.createAccount = function() {
    $state.go('register');
  }
}])