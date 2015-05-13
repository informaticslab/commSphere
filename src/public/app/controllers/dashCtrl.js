commSphereApp.controller('dashCtrl', ['$scope', '$modal','$routeParams','ngEvents','ngRandomData','$http','ngIdentity', function($scope, $modal,$routeParams,ngEvents,ngRandomData,$http,ngIdentity) {

$scope.identity = ngIdentity
$scope.$parent.activeMenu='dashboard';
// set default sort column and direction;
$scope.sortType = "-dateCreated";
//console.log("test");


if($scope.identity.currentUser.roles.levelThree) {  //Filtering for events for analysts

  $http.get('/api/events/analyst/'+$scope.identity.currentUser._id).then(function(res){
  //     console.log(res.data);
       if(res.data) {
           $scope.instances=res.data;
           //getCompletionStatus();
           } else {
               alert('no data received');
           }
  });
    
} else {

  $http.get('/api/events/active').then(function(res){
  //     console.log(res.data);
       if(res.data) {
           $scope.instances=res.data;
           getCompletionStatus();
           } else {
               alert('no data received, assign new id');
           }
      });
  }
    
// if ($routeParams.draftStatus == null)
//    $routeParams.draftStatus = 'active';
// ngEvents.getEvents($routeParams.draftStatus).then(function(response) {
//   $scope.instances = response;
//   getCompletionStatus($scope);
// });


function getCompletionStatus() {    
  for(var i = 0, l = $scope.instances.length; i < l; ++i){
      //$scope.instances[i].randomNumber = ngRandomData.getRandomNumber();  //FOR "random" Mock data remove when real data has been implemented
      oneInstance = $scope.instances[i];
      var categoryCount = 0;
      var completedCount = 0;
      for (category in $scope.instances[i].categories) {
       if ($scope.instances[i].categories.hasOwnProperty(category) && ($scope.instances[i].categories[category].userAssigned != '')) {
            categoryCount++;
            }
       
        if ($scope.instances[i].categories[category].statusCompleted) { 
                 completedCount ++;      
            }
      }
        $scope.instances[i].eventInstanceStatus = Math.round((completedCount / categoryCount*100));

        console.log($scope.instances[i].eventInstanceStatus);
        console.log('category count ' + categoryCount);
        console.log('completed count = ' + completedCount);
  }
};
//    console.log(ProgressStatus(oneInstance.categories));


  
$scope.showInfo = function(instance) {
   $scope.instance = instance;
   var modalInstance = $modal.open({
      scope:$scope,
      templateUrl: '/partials/infoModal',
      controller: infoModalInstanceCtrl,
      windowClass: 'center-modal',
      size: 'md',
      resolve: {
         instance: function () {
           return $scope.instance;
         }
       }
      
    });
};

var infoModalInstanceCtrl = function ($scope, $modalInstance) {

var instance = $scope.instance;
var categoryCount = 0;
var completedCount = 0;

$scope.instance.categories[category].topicCount = 0;
$scope.instance.categories[category].subtopicCount=0;

for (category in instance.categories)
{     
  if (instance.categories.hasOwnProperty(category)) {
      var oneCategory = instance.categories[category];
    //  console.log(oneCategory);
      $scope.instance.categories[category].topicCount = getNodeCount(oneCategory.topics);
      var subTopicCount = 0;
      for (topic in oneCategory.topics) {
          if (oneCategory.topics.hasOwnProperty(topic)) {
            var oneTopic = oneCategory.topics[topic];
            console.log(oneTopic);
            subTopicCount += getNodeCount(oneTopic.subTopics);
           
          }
      }
       $scope.instance.categories[category].subtopicCount = subTopicCount;
            
  }
}
console.log($scope.instance);

function getNodeCount(document) { 
  var nodeCount = 0;
  for (node in document) {
         if (document.hasOwnProperty(node)) 
              nodeCount++;
                     
  }
  return nodeCount;
};

};
}]);

