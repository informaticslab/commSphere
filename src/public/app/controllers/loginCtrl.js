angular.module('app').controller('loginCtrl',function($scope,$http,ngIdentity,ngNotifier,ngAuth,$location,$window){ 
	$scope.identity = ngIdentity;

	$scope.login = function(email, password){
		ngAuth.authenticateUser(email,password).then(function(success) {  //TODO make changes for commSphere usage
			
			if(success) {
				if($scope.identity.currentUser.isLevelTwo()){
					$location.path('/dashboard');
				}
				else if ($scope.identity.currentUser.isLevelOne()) {
					//TODO: admin route
				}
				else if ($scope.identity.currentUser.isLevelThree()){
					$location.path('/dashboard');
				}
				
			} else {
				//console.log(success);
				ngNotifier.notifyError('Incorrect Email/Password');
			}
		});
	};

	


});


