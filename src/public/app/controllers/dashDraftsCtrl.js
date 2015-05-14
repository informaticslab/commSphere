commSphereApp.controller('dashDraftsCtrl', ['$scope', '$modal','$routeParams','ngEvents','$http','$route','$window','$filter','$log', function($scope, $modal,$routeParams,ngEvents,$http,$route,$window,$filter,$log) {

$scope.$parent.activeMenu='drafts';
$scope.sortReverse=true;
$scope.sortType = "dateCreated";

$http.get('/api/events/drafts').then(function(res){
     $log.debug(res.data);
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
        controller: DraftEventModalInstanceCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static',
        resolve: {
         draftInstance: function () {
           return draftInstance;
         }
       }
      });

    // modalInstance.result.then(function (selectedItem) {
    //   $log.debug(selectedItem);
    // }, function () {
    //   $log.debug('Modal dismissed at: ' + new Date());
    // });
    
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

// var DraftEventModalInstanceCtrl = function ($scope, $route, $modalInstance,draftInstance,$log) {

//  $scope.draftInstance = draftInstance;
  
//   // $scope.ok = function () {
//   //   console.log("ok dashctrl");
//   //   $log.debug("ok");
    
//   //   //$route.reload();
//   //   $modalInstance.close();
//   // };

//   // $scope.cancel = function () {
//   //   console.log("cancel dashctrl");
//   //   $log.debug("canceled");
//   //   //$modalInstance.close();
    
//   //   //$route.reload();
//   //   $modalInstance.dismiss();
//   // };
// };

// var DeleteEventModalInstanceCtrl = function ($scope, $route, $modalInstance,draftInstance) {

//  $scope.draftInstance = draftInstance;
//  $scope.removeUser = function() {
  
//   }
  
//   $scope.ok = function () {
//     $modalInstance.close();
//     //$route.reload();
//   };

//   $scope.cancel = function () {
//     $log.debug("canceled");
//     $modalInstance.dismiss('cancel');

//     //$route.reload();
//   };
// };



