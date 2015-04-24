commSphereApp.controller('dashCtrl', ['$scope', '$modal','ngEvents', function($scope, $modal,ngEvents) {


//if ($scope.userType = 'Coordinator') {    
ngEvents.getActiveEvents().then(function(response) {
   $scope.instances = response;
   getCompletionStatus($scope);
});
//}

function getCompletionStatus($scope) {    
for(var i = 0, l = $scope.instances.length; i < l; ++i){
    oneInstance = $scope.instances[i];
    var categoryCount = 0;
    var completedCount = 0;
    for (category in oneInstance.categories) {
             console.log(category);
             if (oneInstance.categories.hasOwnProperty(category)) {
                 categoryCount++;
                 console.log(oneInstance.categories[category].completedStatus);
                 if (oneInstance.categories[category].completedStatus)   
                           completedCount ++;      
             }
    }
      oneInstance.eventInstanceStatus = completedCount / categoryCount;
//    console.log('category count ' + categoryCount);
//    console.log('completed count = ' + completedCount);
    
};
}
//    console.log(ProgressStatus(oneInstance.categories));
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