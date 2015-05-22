commSphereApp.controller('dashCtrl', ['$scope', '$modal','$routeParams','ngEvents','$http','ngIdentity','$log','$filter', function($scope, $modal,$routeParams,ngEvents,$http,ngIdentity,$log,$filter) {
$("body").css("background-color", "#f7f7f7;");
$scope.identity = ngIdentity
$scope.$parent.activeMenu='dashboard';
// set default sort column and direction;
$scope.sortReverse=true;
$scope.sortType = "dateCreated";
// set up pagination
$scope.totalInstances = 0;
$scope.itemsPerPage = 15;
$scope.currentPage = 1;
//Filtering events for analysts
if($scope.identity.currentUser.roles.levelThree) {  //Filtering events for analysts

  $http.get('/api/events/analyst/'+$scope.identity.currentUser._id).then(function(res){
       if(res.data) {
           $scope.instances=res.data;
           //$scope.filteredInstances = $filter('searchAll')($scope.instances,'');
           $scope.totalInstances = $scope.instances.length;
           $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
           $scope.endItem = $scope.beginItem + $scope.itemsPerPage;
           //$scope.filteredInstances = $filter('searchAll')($scope.instances,'').slice(beginItem,endItem);
           } else {
               alert('no data received');
           }
  });
    
} else {

  $http.get('/api/events/active').then(function(res){
       if(res.data) {
           $scope.instances=res.data;
           getCompletionStatus();
           //$scope.filteredInstances = $filter('searchAll')($scope.instances,'');
           $scope.totalInstances = $scope.instances.length;
           $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
           $scope.endItem = beginItem + $scope.itemsPerPage;
           //$scope.filteredInstances = $filter('searchAll')($scope.instances,'').slice(beginItem,endItem);
           } else {
               alert('no data received, assign new id');
           }
      });
  }


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

function getCompletionStatus() {    
  for(var i = 0, l = $scope.instances.length; i < l; ++i){
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

        $log.debug($scope.instances[i].eventInstanceStatus);
        $log.debug('category count ' + categoryCount);
        $log.debug('completed count = ' + completedCount);
  }
};
  
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
    //  $log.debug(oneCategory);
      $scope.instance.categories[category].topicCount = getNodeCount(oneCategory.topics);
      var subTopicCount = 0;
      for (topic in oneCategory.topics) {
          if (oneCategory.topics.hasOwnProperty(topic)) {
            var oneTopic = oneCategory.topics[topic];
            $log.debug(oneTopic);
            subTopicCount += getNodeCount(oneTopic.subTopics);
           
          }
      }
       $scope.instance.categories[category].subtopicCount = subTopicCount;
            
  }
}
$log.debug($scope.instance);

function getNodeCount(document) { 
  var nodeCount = 0;
  for (node in document) {
         if (document.hasOwnProperty(node)) 
              nodeCount++;
                     
  }
  return nodeCount;
};

};
// // pagination functions
// $scope.$watch('$parent.searchText', function (searchText) {
//         if (!searchText){
//           searchText = '';
//         }
//           if ($scope.instances) {
//              $scope.currentPage = 1;
//              var beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
//              var endItem = beginItem + $scope.itemsPerPage;
//              $scope.beginItem=beginItem;
//               $scope.endItem=endItem;
//              $scope.filteredInstances = $filter('searchAll')($scope.instances,searchText).slice(beginItem,endItem);
//             if (searchText =='') {
//                $scope.totalInstances = $scope.instances.length;
//             }
//             else {
//                $scope.totalInstances = $scope.filteredInstances.length;
//             }
//         }
//  });

$scope.pageCount = function () {
    return Math.ceil($scope.totalInstances / $scope.itemsPerPage);
  };

$scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
  };

$scope.pageChanged = function(searchText) {
    $scope.beginItem = (($scope.currentPage - 1) * $scope.itemsPerPage);
    $scope.endItem = beginItem + $scope.itemsPerPage;
    //$scope.filteredInstances = $filter('searchAll')($scope.instances,searchText).slice(beginItem,endItem);
  };
}]);

