angular.module('app').controller('dashEventCtrl', function($scope, $http, $filter, $route,$routeParams, ngNotifier,ngIdentity,$modal,$location,$log) {
$scope.contentloaded=false;
$scope.identity = ngIdentity;

$log.debug($routeParams.id);
$http.get('/api/events/id/'+$routeParams.id).then(function(res){
     if(res.data) {
     $log.debug(res.data[0]);
     $scope.eventdoc=res.data[0];
     $scope.contentloaded = true;
     } else {
         alert('no data received, assign new id');
     }
});

$scope.date = new Date().getTime();
$scope.activeTab="tab_0";

$scope.hideFromCoordinator = function(category) {
    return !($scope.identity.isAuthorized('levelTwo') &&  (category.statusCompleted==false));
    //return false;
    //$log.debug(index);
};

$scope.filterTabForAnalyst = function(category) {
  
   return ((category.userAssigned.id == $scope.identity.currentUser._id) || $scope.identity.currentUser.roles.levelTwo);
};



$scope.setActiveTab = function(tabId)
{
  $log.debug(tabId);
  $scope.activeTab=tabId;

};

    $scope.addTopic = function(category) {
      $log.debug(category);
      // if ($scope.eventdoc.categories.indexOf(category).topics.length > 10) {
      //   window.alert('You can\'t add more than 10 topics!');
      //   return;
      // }
      //var topicName = document.getElementById('topicName').value;
      var topicName = $scope.topicValue[category.name];
      if (topicName.length > 0) {
        category.topics.push({
          name: topicName,
          type: 'topic',
          subTopics: [],
          sortOrder: category.topics.length
        });
        
      }
      $scope.topicValue={};
    };

    $scope.editTopic = function(topic) {
      topic.editing = true;
    };

    $scope.cancelEditingTopic = function(topic) {
      topic.editing = false;
    };

    $scope.saveTopic = function(topic) {
      // topic.save();
      topic.editing = false;
    };

    $scope.removeTopic = function(category, topic) {
      // if (window.confirm('Are you sure to remove this topic?')) {
      //   //topic.destroy();  //TODO
      // }
      $log.debug(category);
      $log.debug(topic);
      var index = category.topics.indexOf(topic);
       if (index > -1) {
         category.topics.splice(index, 1)[0];
       }
    };

    $scope.saveTopics = function() {
      for (var i = $scope.eventdoc.categories[0].topics.length - 1; i >= 0; i--) {
        var topic = $scope.eventdoc.categories[0].topics[i];
        topic.sortOrder = i + 1;
         // topic.save();
      }
    };

    $scope.addSubTopic = function(topic) {
      $log.debug(topic);
      if (!topic.newSubTopicName || topic.newSubTopicName.length === 0) {
        return;
      }
      topic.subTopics.push({
        name: topic.newSubTopicName,
        sortOrder: topic.subTopics.length,
        type: 'subTopic',
        bullets:[]
      });
      topic.newSubTopicName = '';
      // topic.save();
    };

    $scope.removeSubTopic = function(topic, subTopic) {
      //if (window.confirm('Are you sure to remove this subTopic?')) {
        var index = topic.subTopics.indexOf(subTopic);
        if (index > -1) {
          topic.subTopics.splice(index, 1)[0];
        }
        // topic.save();
      //}
    };

    $scope.addBullet = function(subTopic) {
      $log.debug(subTopic);
      if (!subTopic.newBulletName || subTopic.newBulletName.length === 0) {
        return;
      }
      subTopic.bullets.push({
        name: subTopic.newBulletName,
        sortOrder: subTopic.bullets.length,
        type: 'bullet',
        subBullets:[]
      });
      subTopic.newBulletName = '';
      // topic.save();
    };

    $scope.removeBullet = function(subTopic, bullet) {
      //if (window.confirm('Are you sure to remove this subTopic?')) {
        var index = subTopic.bullets.indexOf(bullet);
        if (index > -1) {
          subTopic.bullets.splice(index, 1)[0];
        }
        // topic.save();
      //}
    };

    $scope.addSubBullet = function(bullet) {
      $log.debug(bullet);
      if (!bullet.newSubBulletName || bullet.newSubBulletName.length === 0) {
        return;
      }
      bullet.subBullets.push({
        name: bullet.newSubBulletName,
        sortOrder: bullet.subBullets.length,
        type: 'subBullet'
      });
      bullet.newSubBulletName = '';
      // topic.save();
    };

    $scope.removeSubBullet = function(bullet, subBullet) {
      //if (window.confirm('Are you sure to remove this subTopic?')) {
        var index = bullet.subBullets.indexOf(subBullet);
        if (index > -1) {
          bullet.subBullets.splice(index, 1)[0];
        }
        // topic.save();
      //}
     };

    $scope.editSubTopic = function(subTopic) {
      $log.debug("edit sub topic");
      subTopic.editing = true;
    };

    // $scope.cancelEditingSubTopic = function(topic) {
    //   topic.editing = false;
    // };

    $scope.saveSubTopic = function(subTopic) {
      // topic.save();
      subTopic.editing = false;
    };

      $scope.options = {
      accept: function(sourceNode, destNodes, destIndex) {
        var data = sourceNode.$modelValue;
        var destType = destNodes.$element.attr('data-type');
        return (data.type == destType); // only accept the same type
      },
      dropped: function(event) {
        $log.debug(event);
        var sourceNode = event.source.nodeScope;
        var destNodes = event.dest.nodesScope;
        // update changes to server
        if (destNodes.isParent(sourceNode)
          && destNodes.$element.attr('data-type') == 'subTopic') { // If it moves in the same topic, then only update topic
          var topic = destNodes.$nodeScope.$modelValue;
          // topic.save();
        } else { // save all
          $scope.saveTopics();
        }
      },
      beforeDrop: function(event) {
        // if (!window.confirm('Are you sure you want to drop it here?')) {
        //   event.source.nodeScope.$$apply = false;
        // }
      }
    };


$scope.saveCategory = function (status) {  // save data for the current tab

 var oneCategoryData;
 
 if (ngIdentity.isAuthorized('levelTwo'))
 { // coordinator save
     $log.debug("i am in coordinator save");
     for(var i=0 ; i <$scope.eventdoc.categories.length; i++)
     {
       $log.debug($scope.eventdoc.categories[i]);
       if ($scope.eventdoc.categories[i].statusCompleted) {
            console.log
            oneCategoryData = $scope.eventdoc.categories[i];
            var data = { docId : $scope.eventdoc._id , categoryData : oneCategoryData };
            saveOneCategory(data);
       }
     }
 }
 else
 {  // analyst save 
     for(var i=0 ; i <$scope.eventdoc.categories.length; i++)
     {
       if ($scope.eventdoc.categories[i].name == $scope.activeCategory) {
 //      if ($scope.eventdoc.categories[i].userAssigned.id ==  $scope.identity.currentUser._id) {
            oneCategoryData = $scope.eventdoc.categories[i];
            break;
       }
     }
      if (status === 'completed') {
        oneCategoryData.statusCompleted = true;
        oneCategoryData.dateCompleted = new Date().getTime();
      }
      else {
          oneCategoryData.statusCompleted = false;
      }
      var data = { docId : $scope.eventdoc._id , categoryData : oneCategoryData };
    
        $http.post('/api/events/saveEventCategory',data).then(function(res) {
    
            if(res.data.success) {
              ngNotifier.notify("Event category has been saved!");
              if (oneCategoryData.statusCompleted === true) {
                 $location.path('/dashboard/');
              //   $route.reload();
              }
            } else {
              alert('there was an error');
            }
          });
 }
 
};
function saveOneCategory(data) {
   console.log ("i am in save one category" , data);
   $http.post('/api/events/saveEventCategory',data).then(function(res) {
              if(res.data.success) {
                ngNotifier.notify("Event category "+ data.categoryData.name  + " has been saved!");
              } else {
                alert('there was an error');
              }
            });
            
}

$scope.saveEvent = function () {  // save data for the current document
 
  var data = $scope.eventdoc;

    $http.post('/api/events',data).then(function(res) {

        if(res.data.success) {
          ngNotifier.notify("Event document has been saved!");
        } else {
          alert('there was an error');
        }
      });
};

function getLatestInstance(partialId)
    { 
      $log.debug(partialId);
       
       $http.get('/api/events/getAvailEventId/'+partialId).then(function(res){
        $log.debug(partialId);
         $log.debug(res.data);
         if(res.data) {
             //var eventInstanceIdParts = res.data.eventInstanceId.split("-");
             //$scope.eventInstanceId= eventInstanceIdParts[0] + '-' + String('0'+(Number(eventInstanceIdParts[1]) + 1));
             if(res.data.length>0)
             {
                $log.debug("ID alreADy prsent");
                 return partialId+"xx";
             }
             else
             {
                $log.debug("id available to be used");
                $log.debug(partialId);
                return partialId;
             }
             
             } else {
                 alert('no data received, assign new id');
             }
        });

       
    }

    function genInstanceId(eventName)
    {
        var nameComponent = eventName.toUpperCase().split(' ');
        var instanceId;
        if (nameComponent.length > 1)
            instanceId = nameComponent[0].substr(0,2) + nameComponent[1].substr(0,2)+ '-'+ '01';  
        else
            instanceId = nameComponent[0].substr(0,4)+ '-' + '01';
        return instanceId;
    }
    
    $scope.showInfo = function() {
   $scope.instance = $scope.eventdoc;
   var modalInstance = $modal.open({
      scope:$scope,
      templateUrl: '/partials/moreInfoModal',
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

//var infoModalInstanceCtrl = function ($scope, $modalInstance) {
//
//var instance = $scope.instance;
//$log.debug('instance in modal ',instance);
//var categoryCount = 0;
//var completedCount = 0;
//var category = 0;
//
//
//
//for (category in instance.categories)
//{ 
//  $scope.instance.categories[category.name].topicCount = 0;
//  $scope.instance.categories[category.name].subtopicCount=0;    
//  if (instance.categories.hasOwnProperty(category)) {
//      var oneCategory = instance.categories[category];
//    //  $log.debug(oneCategory);
//      $scope.instance.categories[category].topicCount = getNodeCount(oneCategory.topics);
//      var subTopicCount = 0;
//      for (topic in oneCategory.topics) {
//          if (oneCategory.topics.hasOwnProperty(topic)) {
//            var oneTopic = oneCategory.topics[topic];
//            $log.debug(oneTopic);
//            subTopicCount += getNodeCount(oneTopic.subTopics);
//           
//          }
//      }
//       $scope.instance.categories[category].subtopicCount = subTopicCount;
//            
//  }
//}
//};

var infoModalInstanceCtrl = function ($scope, $modalInstance) {

var instance = $scope.instance;
$log.debug('instance in modal ',instance);
var categoryCount = 0;
var completedCount = 0;




for (var i = 0 ; i < instance.categories.length; i++) 
   
{ 
  $scope.instance.categories[i].topicCount = 0;
  $scope.instance.categories[i].subtopicCount=0;    
  var oneCategory = instance.categories[i];
  //    $log.debug(oneCategory);
      $scope.instance.categories[i].topicCount = getNodeCount(oneCategory.topics);
      var subTopicCount = 0;
      for (topic in oneCategory.topics) {
          if (oneCategory.topics.hasOwnProperty(topic)) {
            var oneTopic = oneCategory.topics[topic];
        //    $log.debug(oneTopic);
            subTopicCount += getNodeCount(oneTopic.subTopics);
           
          }
      }
       $scope.instance.categories[i].subtopicCount = subTopicCount;
            
 
}


  $scope.ok = function () {

    $modalInstance.close();

  };

  $scope.cancel = function () {

    $modalInstance.dismiss();

  };

};

function getCompletionStatus() {    
for(var i = 0, l = $scope.instances.length; i < l; ++i){
    $scope.instances[i].randomNumber = ngRandomData.getRandomNumber();  //FOR "random" Mock data remove when real data has been implemented
    oneInstance = $scope.instances[i];
    var categoryCount = 0;
    var completedCount = 0;
    for (category in oneInstance.categories) {
                   if (oneInstance.categories.hasOwnProperty(category)) {
                 categoryCount++;
//                 $log.debug(oneInstance.categories[category].completedStatus);
                 if (oneInstance.categories[category].completedStatus)   
                           completedCount ++;      
             }
    }
      oneInstance.eventInstanceStatus = completedCount / categoryCount;
//    $log.debug('category count ' + categoryCount);
//    $log.debug('completed count = ' + completedCount);
    
}
};

function getNodeCount(document) { 
  var nodeCount = 0;
  for (node in document) {
        nodeCount++;
  }
  return nodeCount;
};
    
    
$scope.coordinatorAllowed = function() {
  return !ngIdentity.isAuthorized("levelThree") && allCategoriesCompleted($scope);
};

function allCategoriesCompleted(scope)
{  
   var categoryCount = 0;
    var completedCount = 0;
  //  $log.debug($scope.eventdoc.categories);
  try
  {
    for (var i=0; i < scope.eventdoc.categories.length; i++)
    {  var category = scope.eventdoc.categories[i]; 
      if (category.userAssigned)
       {
             categoryCount++;
             if (category.statusCompleted)
              {
                completedCount++;
              }
     }
    } 
  }
  catch(e) {}
  
     return (completedCount == categoryCount && categoryCount > 0);
}

$scope.setActiveCategory = function(category)
{
  $scope.activeCategory= category;
  $scope.activeTab="tab_0";
 // $log.debug("current category ",category);
};

});