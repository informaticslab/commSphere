angular.module('app').controller('dashEventCtrl', function($scope, $http, $filter, $route,$routeParams, ngNotifier,ngIdentity,$modal,$location,$log) {
$scope.contentloaded=false;
$scope.identity = ngIdentity;
$scope.continueNav = true;

//Prevent accidental leaving of dashboard event screen
$scope.$on('$locationChangeStart', function( event ) {
  if (!$scope.continueNav){
      var answer = confirm("Are you sure you want to leave this page?")
      if (!answer) {
          event.preventDefault();
      }
    }
});

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

//hide categories from coordinator if incomplete
$scope.hideFromCoordinator = function(category) {
  return !($scope.identity.isAuthorized('levelTwo') &&  (category.statusCompleted==false));
};

//show tabs only the tabes assigned to logged in user
$scope.filterTabForAnalyst = function(category) {
  if($scope.identity.currentUser)
  {
    return ((category.userAssigned.id == $scope.identity.currentUser._id) || $scope.identity.currentUser.roles.levelTwo); 
  }
};

$scope.returnToAnalyst = function(category) {
// set category statusCompleted flag back to false so analyst could access their assigned category
  category.statusCompleted = false;

  var data = { docId : $scope.eventdoc._id , categoryData : category};

  $http.post('/api/events/saveEventCategory',data).then(function(res) {
    if(res.data.success) {
      ngNotifier.notify(data.categoryData.name  + " has been returned to "+ data.categoryData.userAssigned.displayName);
    } else {
      alert('There was an error, failed to return to analyst.');
    }
  });
  
};



$scope.setActiveTab = function(tabId)
{
  $log.debug(tabId);
  $scope.activeTab=tabId;

};

    // $scope.addTopic = function(category) {
    //   $log.debug(category);
    //   // if ($scope.eventdoc.categories.indexOf(category).topics.length > 10) {
    //   //   window.alert('You can\'t add more than 10 topics!');
    //   //   return;
    //   // }
    //   //var topicName = document.getElementById('topicName').value;
    //   var topicName = $scope.topicValue[category.name];
    //   if (topicName.length > 0) {
    //     category.topics.push({
    //       name: topicName,
    //       type: 'topic',
    //       subTopics: [],
    //       sortOrder: category.topics.length
    //     });
        
    //   }
    //   $scope.topicValue={};
    // };

    // $scope.editTopic = function(topic) {
    //   topic.editing = true;
    // };

    // $scope.cancelEditingTopic = function(topic) {
    //   topic.editing = false;
    // };

    // $scope.saveTopic = function(topic) {
    //   // topic.save();
    //   topic.editing = false;
    // };

    // $scope.removeTopic = function(category, topic) {
    //   // if (window.confirm('Are you sure to remove this topic?')) {
    //   //   //topic.destroy();  //TODO
    //   // }
    //   $log.debug(category);
    //   $log.debug(topic);
    //   var index = category.topics.indexOf(topic);
    //    if (index > -1) {
    //      category.topics.splice(index, 1)[0];
    //    }
    // };

    $scope.saveTopics = function() {
      for (var i = $scope.eventdoc.categories[0].topics.length - 1; i >= 0; i--) {
        var topic = $scope.eventdoc.categories[0].topics[i];
        topic.sortOrder = i + 1;
         // topic.save();
      }
    };

    // $scope.addSubTopic = function(topic) {
    //   $log.debug(topic);
    //   if (!topic.newSubTopicName || topic.newSubTopicName.length === 0) {
    //     return;
    //   }
    //   topic.subTopics.push({
    //     name: topic.newSubTopicName,
    //     sortOrder: topic.subTopics.length,
    //     type: 'subTopic',
    //     bullets:[]
    //   });
    //   topic.newSubTopicName = '';
    //   // topic.save();
    // };

    // $scope.removeSubTopic = function(topic, subTopic) {
    //   //if (window.confirm('Are you sure to remove this subTopic?')) {
    //     var index = topic.subTopics.indexOf(subTopic);
    //     if (index > -1) {
    //       topic.subTopics.splice(index, 1)[0];
    //     }
    //     // topic.save();
    //   //}
    // };

    $scope.addBullet = function(subTopic,e) {
      $log.debug(subTopic);
      if (!subTopic.newBulletName || subTopic.newBulletName.length === 0) {
        return;
      }
      subTopic.bullets.push({
        name: subTopic.newBulletName,
        sortOrder: subTopic.bullets.length,
        type: 'bullet',
        editing:'',
        subBullets:[]
      });
      subTopic.newBulletName = '';
      e.preventDefault();
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

    $scope.editBullet = function(bullet) {
      bullet.editing=true;
    };

    $scope.saveBullet = function(bullet,e) {
      bullet.editing=false;
      e.preventDefault();
    };

    $scope.addSubBullet = function(bullet,e) {
      $log.debug(bullet);
      if (!bullet.newSubBulletName || bullet.newSubBulletName.length === 0) {
        return;
      }
      bullet.subBullets.push({
        name: bullet.newSubBulletName,
        sortOrder: bullet.subBullets.length,
        editing:'',
        type: 'subBullet'
      });
      bullet.newSubBulletName = '';
      e.preventDefault();
      // topic.save();
    };

    $scope.editSubBullet = function(subBullet) {
      subBullet.editing=true;
    };

    $scope.saveSubBullet = function(subBullet,e) {
      subBullet.editing=false;
      e.preventDefault();
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
 { // coordinator save - save data from each category only if category statusCompleted flag = true
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
              if (oneCategoryData.statusCompleted === true) {
                ngNotifier.notify("Thank you. Your information has been submitted for review.");
                $location.path('/dashboard/');
              } else {
                ngNotifier.notify("Saved");
              }
            } else {
              alert('there was an error');
            }
          });
 }
 $scope.continueNav=true;
 var unregister=$scope.$watch('eventdoc', function(newVal, oldVal){
     $log.debug("watching");
      if(newVal!=oldVal)
      {
        $log.debug('changed');
        if(oldVal == undefined){
            //do nothing
        } else {
          $scope.continueNav=false;
          unregister();
        }
        
        $log.debug('oldVal: ', oldVal);
        $log.debug('newVal: ', newVal);
      }
     
    }, true);
};

function saveOneCategory(data) {
  // save category's data only
   $log.debug("i am in save one category" , data);
   $http.post('/api/events/saveEventCategory',data).then(function(res) {
              if(res.data.success) {
                ngNotifier.notify("Event category "+ data.categoryData.name  + " has been saved!");
              } else {
                alert('there was an error');
              }
            });
            
}

function getLatestInstance(partialId)
    { 
      $log.debug(partialId);
       
       $http.get('/api/events/getAvailEventId/'+partialId).then(function(res){
        $log.debug(partialId);
         $log.debug(res.data);
         if(res.data) {
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
  // function to activate "moreinfomodal"
   var modalInstance = $modal.open({
      scope:$scope,
      templateUrl: '/partials/moreInfoModal',
      controller: infoModalInstanceCtrl,
      windowClass: 'center-modal',
      size: 'md',
      resolve: {
         instance: function () {
           return $scope.eventdoc;
         }
       }
      
    });
};


var infoModalInstanceCtrl = function ($scope, $modalInstance) {
// controller for More Information modal popup 
$scope.instance = {};
$log.debug('instance in modal ',$scope.instance);
var categoryCount = 0;
var completedCount = 0;


for (var i = 0 ; i < $scope.eventdoc.categories.length; i++) 
   
{ 
  var oneCategory =  $scope.eventdoc.categories[i];
  var topicCount=oneCategory.topics.length;
      var subTopicCount = 0;
      for (topic in oneCategory.topics) {
        $log.debug('topic object',topic);
        subTopicCount=oneCategory.topics[topic].subTopics.length+subTopicCount;
      }
            
 $scope.instance[oneCategory.name]={topicCount:topicCount,subTopicCount:subTopicCount,name:oneCategory.name,userAssigned:oneCategory.userAssigned.displayName,statusCompleted:oneCategory.statusCompleted,dateCompleted:oneCategory.dateCompleted};
}

$log.debug('eventdoc ',$scope.eventdoc);
  $scope.ok = function () {

    $modalInstance.close();

  };

  $scope.cancel = function () {

    $modalInstance.dismiss();

  };

  $log.debug('instance object:',$scope.instance);

};



function getNodeCount(document) { 
  var nodeCount = 0;
  for (node in document) {
        nodeCount++;
  }
  return nodeCount;
};

$scope.setActiveCategory = function(category)
// retrieve category for the selected category tab
{
  $scope.activeCategory= category;
  $scope.activeTab="tab_0";
};

   var unregister=$scope.$watch('eventdoc', function(newVal, oldVal){
     $log.debug("watching");
      if(newVal!=oldVal)
      {
        $log.debug('changed');
        if(oldVal == undefined){
            //do nothing
        } else {
          $scope.continueNav=false;
          unregister();
        }
        
      }
     
    }, true);

});