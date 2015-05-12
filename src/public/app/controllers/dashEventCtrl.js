angular.module('app').controller('dashEventCtrl', function($scope, $http, $filter, $route,$routeParams, ngNotifier,ngIdentity,$modal,$location) {


$scope.myInstance = {}; 
$scope.eventName ="";
$scope.eventType = "";
$scope.eventInstanceId="";
$scope.topicValue={};
  $scope.subTopicValue={};
  $scope.userAssigned={};
  $scope.eventName='';
console.log($routeParams.id);
$http.get('/api/events/id/'+$routeParams.id).then(function(res){
     if(res.data) {
     console.log(res.data[0]);
     $scope.eventdoc=res.data[0];
     
     } else {
         alert('no data received, assign new id');
     }
});

// $scope.eventdoc = {
//   "eventName": "",
//   "eventType": "",
//   "eventInstanceId": "",
//   "userCreated": "",
//   "dateCreated": "",
//   "draftStatus": true,
//   "categories": [
//     {
//       "name": "Web",
//       "userAssigned": "",
//       "statusCompleted": false,
//       "dateCompleted": "",
//       "topics": [
//         {
//           "name": "TOPIC 1",
//           "type": "topic",
//           "subTopics": [
//             {
//               "name": "SUB TOPIC 1",
//               "sortOrder": 0,
//               "type": "subTopic",
//               "bullets": []
//             },
//             {
//               "name": "SUB TOPIC 2",
//               "sortOrder": 1,
//               "type": "subTopic",
//               "bullets": []
//             }
//           ],
//           "sortOrder": 1,
//           "editing": false,
//           "newSubTopicName": ""
//         },
//         {
//           "name": "TOPIC 2",
//           "type": "topic",
//           "subTopics": [
//             {
//               "name": "SUBTOPIC 2 1",
//               "sortOrder": 0,
//               "type": "subTopic",
//               "bullets": []
//             },
//             {
//               "name": "SUB TOPIC 2 2",
//               "sortOrder": 1,
//               "type": "subTopic",
//               "bullets": []
//             }
//           ],
//           "sortOrder": 2,
//           "editing": false,
//           "newSubTopicName": ""
//         }
//       ]
//     },
//     {
//       "name": "TV",
//       "userAssigned": "",
//       "statusCompleted": false,
//       "dateCompleted": "",
//       "topics": []
//     },
//     {
//       "name": "Print",
//       "userAssigned": "",
//       "statusCompleted": false,
//       "dateCompleted": "",
//       "topics": []
//     }
//   ]
// };

// $scope.users=['Dan','John','Steven','Paul','Tom']; //hardcoded placeholder
//$scope.eventTypes=['Earthquake','Hurricane','Flood', 'Infectious Disease', 'Famine'] //hardcoded placeholder
$scope.currentUser = ngIdentity.currentUser;
$scope.date = new Date().getTime();
$scope.activeTab="tab_0";
//$scope.eventdoc.categories[0].topics = $scope.eventdoc.categories[0].topics;
//console.log(ngIdentity.currentUser);
//console.log(ngIdentity.currentUser.roles.levelOne);

$scope.noEdit = function () {
  // assuming that the current category assigned user is matching with the current user
    return !ngIdentity.isAuthorized("LevelOne") &&  $scope.eventdoc.categories[0].draftStatus==true ;
 //     return true;
};
$scope.notAllowed = function() {
 //  return !ngIdentity.isAuthorized("LevelOne");
     return false;
};
console.log($scope.noEdit);

$scope.setActiveTab = function(tabId)
{
  console.log(tabId);
  $scope.activeTab=tabId;

};

    $scope.addTopic = function(category) {
      console.log(category);
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
      console.log(category);
      console.log(topic);
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
      console.log(topic);
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
      console.log(subTopic);
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
      console.log(bullet);
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
      console.log("edit sub topic");
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
        console.log(event);
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



// $scope.addTopic=function(category)
// {
  
//  var newTopic=$scope.topicValue[category];
//  console.log(newTopic);

//  newTopic=$filter('escapeDot')(newTopic);

//  if(newTopic=="")
//  {
//    ngNotifier.notifyError("Topic cannot be blank");
//  }
//  else if(newTopic.trim()=="")
//  {
//    ngNotifier.notifyError("Topic cannot be blank");
//  }
//  else
//  {

//    if($scope.eventdoc.categories[category].topics==undefined)
//    {
//      $scope.eventdoc.categories[category].topics={};
//    }


//    if($scope.eventdoc.categories[category].topics[newTopic])
//    {
//      ngNotifier.notifyError(newTopic+" already exists");
//    }
//    else
//    {
//      $scope.eventdoc.categories[category].topics[newTopic]={};
//      $scope.eventdoc.categories[category].topics[newTopic].displayValue=newTopic;
//    }

//    $scope.topicValue[category]="";
    
//    console.log($scope.eventdoc);
//  }
// };


// $scope.deleteTopic=function(category,topic)
// {
  
//  delete $scope.eventdoc.categories[category].topics[topic];
//  console.log($scope.eventdoc);

// };


// $scope.addSubTopic=function(category,topic)
// {
//  console.log(category,topic);
//  console.log($scope.eventdoc);
  
//  var newSubTopic=$scope.subTopicValue[category+'-'+topic];

//  if(newSubTopic=="")
//  {
//    ngNotifier.notifyError("Sub Topic cannot be blank");
//  }
//  else if(newSubTopic.trim()=="")
//  {
//    ngNotifier.notifyError("Sub Topic cannot be blank");
//  }
//  else
//  {
//    console.log(newSubTopic,$scope.eventdoc.categories[category].topics[topic].subTopics);

//    if($scope.eventdoc.categories[category].topics[topic].subTopics==undefined)
//    {
//      $scope.eventdoc.categories[category].topics[topic].subTopics={};
//    }


//    if($scope.eventdoc.categories[category].topics[topic].subTopics[newSubTopic])
//    {
//      ngNotifier.notifyError(newSubTopic+" already exists");
//    }
//    else
//    {
//      //$scope.eventdoc.categories[category].topics[topic].subTopics={};

//      $scope.eventdoc.categories[category].topics[topic].subTopics[newSubTopic]={}
//      $scope.eventdoc.categories[category].topics[topic].subTopics[newSubTopic].displayValue=newSubTopic;
//    }
    
//    $scope.subTopicValue[category+'-'+topic]="";
//  }



// };

$scope.assignUser = function(category) {
  var userAssigned = $scope.userAssigned[category];
  $scope.eventdoc.categories[category].userAssigned = userAssigned;
};

$scope.createEvent = function() {
  console.log($scope.eventdoc.eventInstanceId);
  //var formattedEventInstanceId = 'EQSA-01'; //TODO: Create actual eventInstanceId do this on server-side?


  $http.get('/api/events/duplicate/'+$scope.eventName).then(function(res) {
  
  //console.log(res.data.duplicate);
    if($scope.eventName.trim() == ''){
    ngNotifier.notifyError('Event name cannot be blank');
  } else if($scope.eventName.replace(/ /g,'').match(/^[0-9]+$/) != null ) {
    ngNotifier.notifyError('Event name cannot contain only numbers');
  } else if(res.data.duplicate) {
    ngNotifier.notifyError('Cannot create event. Duplicate name');
  }  else if($scope.eventType == undefined) {
    ngNotifier.notifyError('Please select an event type');
  } else {

    //data = $scope.eventdoc;
    var currentUser = 'Joe Coordinator'; //hardcoded placeholder

    //data = $scope.document;
    $scope.eventdoc.eventName = $scope.eventName;
    $scope.eventdoc.eventType = $scope.eventType;
    $scope.eventdoc.eventInstanceId = ""; 
    $scope.eventdoc.userCreated = currentUser;
    $scope.eventdoc.dateCreated = $scope.date;
    $scope.eventdoc.draftStatus = false;

        var partialId = genInstanceId($scope.eventName);

        $http.get('/api/events/getAvailEventId/'+partialId).then(function(res){
//        console.log(partialId);
//        console.log(res.data);
         if(res.data) {
             //var eventInstanceIdParts = res.data.eventInstanceId.split("-");
             //$scope.eventInstanceId= eventInstanceIdParts[0] + '-' + String('0'+(Number(eventInstanceIdParts[1]) + 1));
             if(res.data.length>0)
             {
//                console.log("ID alreADy prsent");
                 $scope.eventdoc.eventInstanceId= partialId+"xx";
             }
             else
             {
//                console.log("id available to be used");
//                console.log(partialId);
                $scope.eventdoc.eventInstanceId= partialId;
             }

//      console.log("eventIDNew",$scope.eventdoc.eventInstanceId);

      $scope.eventdoc.userCreated = currentUser;
      $scope.eventdoc.dateCreated = new Date().getTime();
//      console.log($scope.eventdoc);
//      console.log($scope.eventdoc.eventInstanceId);
      $http.post('/api/events', $scope.eventdoc).then(function(res) {

        if(res.data.success) {
          ngNotifier.notify("Event has been saved!");
          $route.reload();

        } else {
          alert('there was an error');
        }
      });

      $scope.ok();
             
             } else {
                 alert('no data received, assign new id');
             }
        });


  }  
  });
  
  
  
};

$scope.saveCategory = function (status) {  // save data for the current tab
 // var oneCategoryData = $filter('filter')($scope.eventdoc.categories, {'name' : $scope.activeCategory});
  var oneCategoryData = $scope.eventdoc.categories[0];
  console.log(oneCategoryData);
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
};

function getLatestInstance(partialId)
    { 
      console.log(partialId);
       
       $http.get('/api/events/getAvailEventId/'+partialId).then(function(res){
        console.log(partialId);
         console.log(res.data);
         if(res.data) {
             //var eventInstanceIdParts = res.data.eventInstanceId.split("-");
             //$scope.eventInstanceId= eventInstanceIdParts[0] + '-' + String('0'+(Number(eventInstanceIdParts[1]) + 1));
             if(res.data.length>0)
             {
                console.log("ID alreADy prsent");
                 return partialId+"xx";
             }
             else
             {
                console.log("id available to be used");
                console.log(partialId);
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
//console.log('instance in modal ',instance);
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
//    //  console.log(oneCategory);
//      $scope.instance.categories[category].topicCount = getNodeCount(oneCategory.topics);
//      var subTopicCount = 0;
//      for (topic in oneCategory.topics) {
//          if (oneCategory.topics.hasOwnProperty(topic)) {
//            var oneTopic = oneCategory.topics[topic];
//            console.log(oneTopic);
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
console.log('instance in modal ',instance);
var categoryCount = 0;
var completedCount = 0;




for (var i = 0 ; i < instance.categories.length; i++) 
   
{ 
  $scope.instance.categories[i].topicCount = 0;
  $scope.instance.categories[i].subtopicCount=0;    
  if (instance.categories.hasOwnProperty(category)) {
      var oneCategory = instance.categories[category];
      console.log(oneCategory);
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
//                 console.log(oneInstance.categories[category].completedStatus);
                 if (oneInstance.categories[category].completedStatus)   
                           completedCount ++;      
             }
    }
      oneInstance.eventInstanceStatus = completedCount / categoryCount;
//    console.log('category count ' + categoryCount);
//    console.log('completed count = ' + completedCount);
    
}
};

function getNodeCount(document) { 
  var nodeCount = 0;
  for (node in document) {
         if (document.hasOwnProperty(node)) 
              nodeCount++;
                     
  }
  return nodeCount;
};
    
});