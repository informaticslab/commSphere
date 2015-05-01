angular.module('app').controller('loginCtrl',function($scope,$http,ngIdentity,ngNotifier,ngAuth,$location,$window){ 
	$scope.identity = ngIdentity;

	$scope.signin = function(email, password){
		ngAuth.authenticateUser(email,password).then(function(success) {  //TODO make changes for commSphere usage
			
			if(success) {
				if($scope.identity.currentUser.isLevelTwo()){
					$location.path('/adminCRQueue');
				}
				else if ($scope.identity.currentUser.isLevelOne()) {
					$location.path('/adminRights');
				}
				else if ($scope.identity.currentUser.isLevelThree()){
					$location.path('/adminCREdit');
				}
				$scope.ok();

			} else {
				//console.log(success);
				ngNotifier.notifyError('Incorrect Email/Password');
			}
		});
	};

	$scope.signout = function(){
		ngAuth.logoutUser().then(function() {
			$scope.email = "";
			$scope.password = "";
			
			
			//This is for PIV
//			if($location.protocol()=='https'){
//				$window.location = $location.absUrl().replace('https','http').replace('4400','8089');
//			}
//			else{
//				$location.path('/');    /
//			}
		});
	};



});


