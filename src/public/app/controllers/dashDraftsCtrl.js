commSphereApp.controller('dashDraftsCtrl', ['$scope', '$modal','$routeParams','ngEvents','$http', function($scope, $modal,$routeParams,ngEvents,$http) {

$scope.$parent.activeMenu='drafts';

$http.get('/api/events/drafts').then(function(res){
//     console.log(res.data);
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
    
    };


}]);

var CreateEventModalInstanceCtrl = function ($scope, $route, $modalInstance,draftInstance) {

 $scope.draftInstance = draftInstance;
  
  $scope.ok = function () {
    $modalInstance.close();
    $route.reload();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
    $route.reload();
  };
};