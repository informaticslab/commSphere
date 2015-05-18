commSphereApp.controller('rootCtrl', ['$scope', '$modal','$routeParams','ngEvents','ngAuth','$location','ngIdentity','$route','$log', function($scope, $modal,$routeParams,ngEvents,ngAuth, $location, ngIdentity,$route,$log) {

$("#wrapper").show();
$scope.activeMenu='';
$scope.searchText='';
$scope.identity = ngIdentity;

if($scope.identity.currentUser === undefined){  //changed background color based on authenticated or not
  $("body").css("background-color", "#2a2d33;");
}
else
{
  $("body").css("background-color", "#f7f7f7;");
}

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
      $("body").css("background-color", "#2a2d33;");
		});
	};

  $scope.showAvailEvents = function (size) {
  // retrieve all events with active and archived status pending users requirements
      var modalInstance = $modal.open({
        templateUrl: '/partials/availEventSModal',
        controller: importEventModalCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static'
      });
      modalInstance.result.then(function (selectedInstance) {
      // user selected one event, pass it to create event function
          $scope.cleanDoc(selectedInstance);
          $scope.createEvent('lg',selectedInstance); 
      }, function () {
            $log.info('Modal dismissed at: ' + new Date());
      });
     };
     
$scope.cleanDoc = function(selectedInstance)
{  delete selectedInstance._id;
   selectedInstance.eventInstanceId = "";
   selectedInstance.userCreated =  {id:$scope.identity.currentUser._id, displayName: $scope.identity.currentUser.displayName};
   selectedInstance.dateCreated = "";
   selectedInstance.draftStatus = true;
   selectedInstance.archiveStatus =  false;
   for (var i=0; i < selectedInstance.categories.length; i++)
   {
       selectedInstance.categories[i].statusCompleted = false;
       selectedInstance.categories[i].dateCompleted = "";
   }
   
   console.log(selectedInstance);
};


}]);


var CreateEventModalInstanceCtrl = function ($scope, $modalInstance,$location,$route,$timeout,$animate,draftInstance) {
 $scope.draftInstance = draftInstance;
  $scope.ok = function () {
    $animate.enabled(true);
    $modalInstance.close();
    $route.reload();
  };

  $scope.cancel = function () {
    $animate.enabled(true);
    $modalInstance.dismiss();
    $timeout($route.reload,500);
  };
};

var importEventModalCtrl = function ($scope, $modalInstance,$location,$route,$timeout,$http) {
// display modal popup to show list of available events   
  $http.get('/api/events/getEventsForImport').then(function(res){
       if(res.data) {
           $scope.importInstances=res.data;
           } else {
               alert('no data received');
           }
      });
      
  $scope.importInstance = function(instance)
  {
     $modalInstance.close(instance);
  };
  
  $scope.ok = function () {
    $modalInstance.close();
    $route.reload();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss();
    $route.reload();
  };
};


