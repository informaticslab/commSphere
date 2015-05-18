commSphereApp.controller('dashDraftsCtrl', ['$scope', '$modal','$routeParams','ngEvents','$http','$route','$window','$filter','$log', function($scope, $modal,$routeParams,ngEvents,$http,$route,$window,$filter,$log) {

$scope.$parent.activeMenu='drafts';
$scope.sortReverse=true;
$scope.sortType = "dateCreated";

$http.get('/api/events/drafts').then(function(res){
// retrieve all draft instances from the database  
     $log.debug(res.data);
     if(res.data) {
         $scope.instances=res.data;
         } else {
             alert('no data received, assign new id');
         }
    });

$scope.editDraft = function (size,draftInstance) {
// activate the modal for edit draft  
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
    };

$scope.deleteDraft = function (draftInstance) {
  // delete the passed in draft instance
    var draftDate = $filter('date')(draftInstance.dateCreated,'MM/dd/yyyy - hh:mm:ss');
    var deleteConfirm = $window.confirm('Are you absolutely sure you want to delete draft:' + draftInstance.eventName +' created on ' + draftDate + '? ');

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
    };


}]);

var DraftEventModalInstanceCtrl = function ($scope, $route, $modalInstance,draftInstance,$log) {
// controller for draft edit modal screen
 $scope.draftInstance = draftInstance;
  
  $scope.ok = function () {
    $log.debug("ok");
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $log.debug("canceled");
    $modalInstance.dismiss();
  };
};
