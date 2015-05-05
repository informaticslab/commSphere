commSphereApp.controller('rootCtrl', ['$scope', '$modal','$routeParams','ngEvents', function($scope, $modal,$routeParams,ngEvents) {

$scope.activeMenu='';
$scope.searchText='';

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

}]);


var CreateEventModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};