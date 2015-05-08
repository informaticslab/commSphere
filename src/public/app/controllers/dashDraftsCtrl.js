commSphereApp.controller('dashDraftsCtrl', ['$scope', '$modal','$routeParams','ngEvents','$http','$route','$window','$filter', function($scope, $modal,$routeParams,ngEvents,$http,$route,$window,$filter) {

$scope.$parent.activeMenu='drafts';
$scope.sortReverse=true;
$scope.sortType = "dateCreated";

$http.get('/api/events/drafts').then(function(res){
     console.log(res.data);
     if(res.data) {
         $scope.instances=res.data;
      //   getCompletionStatus();
         } else {
             alert('no data received, assign new id');
         }
    });

$scope.editDraft = function (size,draftInstance) {
 
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

    modalInstance.result.then(function (selectedItem) {
      console.log(selectedItem);
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
    
    };

$scope.deleteDraft = function (draftInstance) {
    var draftDate = $filter('date')(draftInstance.dateCreated,'MM/dd/yyyy - hh:mm:ss');
    var deleteConfirm = $window.confirm('Are you absolutely sure you want to delete drarft:' + draftInstance.eventName +' created on ' + draftDate + '? ');

    if (deleteConfirm) {
      
       $http.post('/api/events/drafts/delete/'+draftInstance._id).then(function(res){
       if(res.data) {
            // delete success
            $route.reload();
         } 
         else {
             alert('delete failed');
         }
    });
         
    }
//        var modalInstance = $modal.open({
//        templateUrl: '/partials/confirmDeleteDraftModal',
//        controller: DeleteEventModalInstanceCtrl,
//        size: 'md',
//        keyboard: false,
//        backdrop: 'static',
//        resolve: {
//         draftInstance: function () {
//           return draftInstance;
//         }
//       }
//      });
    
    };


}]);

var CreateEventModalInstanceCtrl = function ($scope, $route, $modalInstance,draftInstance) {

 $scope.draftInstance = draftInstance;
  
  $scope.ok = function () {
    console.log("ok");
    $modalInstance.close();
    //$route.reload();
  };

  $scope.cancel = function () {
    console.log("canceled");
    $modalInstance.close();
    //$modalInstance.dismiss('cancel');
    //$route.reload();
  };
};

var DeleteEventModalInstanceCtrl = function ($scope, $route, $modalInstance,draftInstance) {

 $scope.draftInstance = draftInstance;
 $scope.removeUser = function() {
  
  }
  
  $scope.ok = function () {
    $modalInstance.close();
    //$route.reload();
  };

  $scope.cancel = function () {
    console.log("canceled");
    $modalInstance.dismiss('cancel');

    //$route.reload();
  };
};



