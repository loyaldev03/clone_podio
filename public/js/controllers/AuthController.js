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
  $scope.error = "";
  $scope.login_submitted = false; 
  $scope.error_for_login = "";

  $scope.register = function(){
    $scope.submitted = true;
    s_auth.register($scope.user).error(function(error){
      if (error.message == 'email is not verified') {
        $scope.error = 'This user already exists, but has not been verified yet. <a href="#/sendactivationemail/' + $scope.user.username + '">Resend verification mail?</a>'
      }
      else {
        $scope.error = error.message;
      }
    }).then(function(){
      $state.go( "verify_account" );
    });
  };

  $scope.registerOrganization = function() {
    s_auth.registerOrganization($scope.user.organization).error(function(err){
      $scope.error = err.message;
    }).then(function() {
      $state.go("dashboard");
    })
  }
  
  $scope.logIn = function(){
    $scope.login_submitted = true;
    s_auth.logIn($scope.user).error(function(error){
      if (error.message == "wrong username") {
        $scope.error_for_login = "This LinkaBee account doens't exist. Enter in a different account or create one <a href='/#/register'>here</a>.";
      }
      else if (error.message == "wrong password") {
        $scope.error_for_login = "Invalid password. Please try again.";
      }
      else if (error.message == "not verified yet") {
        $scope.error_for_login = "Sorry, your account was never verified. <a href='/#/register'>Sign up</a> for a new one or click here to receive a <a href='#/sendactivationemail/" + $scope.user.username + "'>new confirmation link</a>.";
      }
      else if (error.message == "empty fields") {
        $scope.error_for_login = "The username and password fields are required";
      }
    }).then(function(){
      $state.go( "verify_account" );
    });
  };

  $scope.activate = function(username) {
    console.log(username);
  }
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

  $scope.getEmail = function() {
    return s_auth.getEmail();
  }

  $scope.sendConfirmationEmail = function() {
    s_auth.sendConfirmationEmail().then(function(res){
      $state.go("verify");
    });
  }
  $scope.user = {};
  //for profile registration page with social login
  $scope.user.email = s_auth.getEmail();

  //password reset logic
  $scope.notification_for_password_reset_request = "";
  $scope.error_for_password_reset = "";
  $scope.sendPasswordResetRequest = function() {
    $scope.notification_for_password_reset_request = "Further instructions have been sent to your email.";
    s_auth.sendPasswordResetReqeust($scope.email_for_password_reset);
    $scope.email_for_password_reset = "";
  }

  $scope.resetPassword = function() {
    if (!$scope.new_password || !$scope.confirm_password) {
      $scope.error_for_password_reset = "Please fill in all fields";
    }
    else if ($scope.new_password != $scope.confirm_password) {
      $scope.error_for_password_reset = "New Password and Confirm Password must be same!";
    }
    else {
      s_auth.passwordReset($stateParams.email, $stateParams.token, $scope.new_password).then(function(res){
          $state.go('login');
      });      
    }
  }
}])