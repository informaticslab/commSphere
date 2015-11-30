angular.module('app').controller('loginCtrl',function($scope,$http,ngIdentity,ngNotifier,ngAuth,$location,$window,$log){ 
	$scope.identity = ngIdentity;
	$scope.usernameLoginShow = false;
	
	if($scope.identity.isAuthenticated()) {
		$location.path('/');
	}
	$scope.login = function(email, password){
		ngAuth.authenticateUser(email,password).then(function(success) {  
			
			if(success) {
				if($scope.identity.currentUser.isLevelTwo()){
					$location.path('/dashboard');
				} else if ($scope.identity.currentUser.isLevelThree()){
					$location.path('/dashboard');
				}
				// } else if ($scope.identity.currentUser.isLevelOne()) {  //Comment out admin route for now, until we decide if we need an admin role.
				// 	//TODO: admin route
				// }
				$("body").css("background-color", "#FFF;");
			} else {
				//$log.debug(success);
				ngNotifier.notifyError('Incorrect Email/Password');
			}
		});
		
	};

	 $scope.pivLogin = function(){   //only function is to kick off the switch to HTTPS for Certificate Authentication
		//todo
	   	var forceSsl = function () {
			$window.location.href = $location.absUrl().replace('http','https').replace('9000','4400');
		 };
		var protocol = $location.protocol();

		if($location.protocol() != 'https'){
			forceSsl();
		}
		
	};

	$scope.usernameLogin = function() {
		$scope.usernameLoginShow = true;
	};

});


