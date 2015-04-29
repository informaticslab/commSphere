commSphereApp.controller('rootCtrl', ['$scope', '$modal','$routeParams','ngEvents', function($scope, $modal,$routeParams,ngEvents) {

$scope.activeMenu='';
$scope.searchText='';

$scope.createEvent = function (size) {

      var modalInstance = $modal.open({
        templateUrl: '/partials/createEventModal',
        controller: CreateEventModalInstanceCtrl,
        size: size,
        keyboard: false,
        backdrop: 'static'
      });
    
    }

}]);


var CreateEventModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};