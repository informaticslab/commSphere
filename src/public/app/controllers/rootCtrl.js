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

$scope.createEvent = function (size,draftInstance,isNew) {

      var modalInstance = $modal.open({
        templateUrl: '/partials/createEventModal',
        controller: CreateEventModalInstanceCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static',
        resolve: {
         draftInstance: function () {
           return draftInstance;
         },
         isNew : function() {
            return isNew;
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
        templateUrl: '/partials/availEventsModal',
        controller: importEventModalCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static'
      });
      modalInstance.result.then(function (selectedInstance) {
      // user selected one event, pass it to create event function
          $scope.cleanDoc(selectedInstance);
          $scope.createEvent('lg',selectedInstance,false); 
      }, function () {
            $log.info('Modal dismissed at: ' + new Date());
      });
     };
     
$scope.cleanDoc = function(selectedInstance)
{  delete selectedInstance._id;
 //  selectedInstance.eventInstanceId = "";
   selectedInstance.userCreated =  {id:$scope.identity.currentUser._id, displayName: $scope.identity.currentUser.displayName};
   selectedInstance.dateCreated = "";
   selectedInstance.draftStatus = true;
   selectedInstance.archiveStatus =  false;
   for (var i=0; i < selectedInstance.categories.length; i++)
   {
       selectedInstance.categories[i].statusCompleted = false;
       selectedInstance.categories[i].dateCompleted = "";
   }
   
   $log.debug(selectedInstance);
};


}]);


var CreateEventModalInstanceCtrl = function ($scope, $modalInstance,$location,$route,$timeout,$animate,draftInstance,isNew) {
 $scope.draftInstance = draftInstance;
 $scope.isNew = isNew;
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

var importEventModalCtrl = function ($scope, $modalInstance,$location,$route,$timeout,$http,$filter) {
// display modal popup to show list of available events   
$scope.sortReverse=true;
$scope.sortType = "dateCreated";

//setup pagination here
$scope.totalInstances = 0;
$scope.itemsPerPage = 10;
$scope.currentPage = 1;

  $http.get('/api/events/getEventsForImport').then(function(res){
       if(res.data) {
           $scope.instances=res.data;
           //$scope.filteredInstances = $filter('searchAll')($scope.importInstances,'');
           $scope.totalInstances = $scope.instances.length;
          $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
          $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
           //$scope.filteredInstances = $filter('searchAll')($scope.importInstances,'').slice(beginItem,endItem);
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
  
 //  $scope.$watch('searchText', function (searchText) {
 //        if (!searchText){
 //          searchText = '';
 //        }
 //          if ($scope.importInstances) {
 //             $scope.currentPage = 1;
 //             var beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
 //             var endItem = beginItem + $scope.itemsPerPage;
 //             $scope.filteredInstances = $filter('searchAll')($scope.importInstances,searchText).slice(beginItem,endItem);
 //            if (searchText =='') {
 //               $scope.totalInstances = $scope.importInstances.length;
 //            }
 //            else {
 //               $scope.totalInstances = $scope.filteredInstances.length;
 //            }
 //        }
 // });
  $scope.pageCount = function () {
    return Math.ceil($scope.totalInstances / $scope.itemsPerPage);
  };

$scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

$scope.pageChanged = function(searchText) {
    $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
    $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
    //$scope.filteredInstances = $filter('searchAll')($scope.importInstances,searchText).slice(beginItem,endItem);
  };

  $scope.sortInstances = function(sortType) {
  if($scope.sortReverse)
  {
    $scope.instances.sort(compareAsc);  
  }
  else
  {
    $scope.instances.sort(compareDesc);
  }

}

function compareAsc(a,b) {
  if (a[$scope.sortType] < b[$scope.sortType])
    return -1;
  if (a[$scope.sortType] > b[$scope.sortType])
    return 1;
  return 0;
}

function compareDesc(a,b) {
  if (a[$scope.sortType] > b[$scope.sortType])
    return -1;
  if (a[$scope.sortType] < b[$scope.sortType])
    return 1;
  return 0;
}

};


