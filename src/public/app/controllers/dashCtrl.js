commSphereApp.controller('dashCtrl', ['$scope', '$modal','$routeParams','ngEvents','ngRandomData', function($scope, $modal,$routeParams,ngEvents,ngRandomData) {

$scope.$parent.activeMenu='dashboard';

if ($routeParams.draftStatus == null)
    $routeParams.draftStatus = 'active';
ngEvents.getEvents($routeParams.draftStatus).then(function(response) {
   $scope.instances = response;
   getCompletionStatus($scope);
});


function getCompletionStatus($scope) {    
for(var i = 0, l = $scope.instances.length; i < l; ++i){
    $scope.instances[i].randomNumber = ngRandomData.getRandomNumber();  //FOR "random" Mock data remove when real data has been implemented
    oneInstance = $scope.instances[i];
    var categoryCount = 0;
    var completedCount = 0;
    for (category in oneInstance.categories) {
                   if (oneInstance.categories.hasOwnProperty(category)) {
                 categoryCount++;
//                 console.log(oneInstance.categories[category].completedStatus);
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
  


}]);

