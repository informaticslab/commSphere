commSphereApp.controller('rootCtrl', ['$scope', '$modal','$routeParams','ngEvents','ngAuth','$location','ngIdentity','$route', function($scope, $modal,$routeParams,ngEvents,ngAuth, $location, ngIdentity,$route) {

$scope.activeMenu='';
$scope.searchText='';
$scope.identity = ngIdentity;

$scope.createEvent = function (size,draftInstance) {

      var modalInstance = $modal.open({
        templateUrl: '/partials/createEventModal',
        controller: CreateEventModalInstanceCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static',
        resolve: {
         draftInstance: function () {
           return draftInstance;
         }
       }
      });
    
    };

$scope.logout = function(){
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
      $location.path('/login')
		});
	};

}]);


var CreateEventModalInstanceCtrl = function ($scope, $modalInstance,$location,$route) {

  $scope.ok = function () {
    console.log($location.path);
    $modalInstance.close();
    $route.reload();
  };

  $scope.cancel = function () {
    console.log($location.path);
    $modalInstance.dismiss();
    $route.reload();
  };
};