angular.module('app').controller('createEventCtrl', function($scope, $http, $filter, $route, ngNotifier,$location,$interval,$animate,ngIdentity, ngUser) {
$scope.identity = ngIdentity;

$animate.enabled(false, "div");
  // var draftInstance = $scope.draftInstance;
  // console.log("draftInstance", draftInstance);
$scope.allowSaveDrafts=false;
  var secondUnit = 1000;
  var autoSave;

  autoSave = $interval(function() {
    //$scope.checkDirty();
  }, 60 * secondUnit);


  $scope.$on('$destroy', function() {
    console.log($scope.eventdoc );
    if($scope.eventdoc.draftStatus)
    {
      if($scope.allowSaveDrafts)
      {
        console.log("saving");
        $scope.saveDraftEvent();
      }
      
    }
    $interval.cancel(autoSave);

  });



  $scope.topicValue = {};
  $scope.subTopicValue = {};
  $scope.userAssigned = {};

  $scope.users = [];

  $scope.eventdoc = {
    "eventName": "",
    "eventType": "",
    "eventInstanceId": "",
    "userCreated": "",
    "dateCreated": "",
    "draftStatus": true,
    "archiveStatus": false,
    categories: [{
      name: 'Web',
      "userAssigned": "",
      "statusCompleted": false,
      "dateCompleted": "",
      topics: [

      ]
    }, {
      name: 'TV',
      "userAssigned": "",
      "statusCompleted": false,
      "dateCompleted": "",
      topics: [

      ]
    }, {
      name: 'Print',
      "userAssigned": "",
      "statusCompleted": false,
      "dateCompleted": "",
      topics: [

      ]
    }, ]
  };

  if ($scope.draftInstance) {
    $scope.eventdoc = $scope.draftInstance;
  }


  $scope.eventTypes = ['Earthquake', 'Hurricane', 'Flood', 'Infectious Disease', 'Famine'] //hardcoded placeholder
    //$scope.date = new Date().getTime();
  $scope.date = new Date().getTime(); // need both date and time

  $scope.eventdoc.userCreated = {id:$scope.identity.currentUser._id, displayName: $scope.identity.currentUser.displayName};
  var previousData = angular.toJson($scope.eventdoc);


  $http.get('/api/users/analysts').then(function(res) {
  var analysts = res.data;
  for(var i=0; i < analysts.length; i++) {
    $scope.users.push({'id':analysts[i]._id, 'displayName':analysts[i].displayName });
    // $scope.users.push(analysts[i].displayName);
  }
  });


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
    $scope.topicValue = {};
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
      bullets: []
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
      if (destNodes.isParent(sourceNode) && destNodes.$element.attr('data-type') == 'subTopic') { // If it moves in the same topic, then only update topic
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

  $scope.createEvent = function() {
    console.log($scope.eventdoc.eventInstanceId);
    //var formattedEventInstanceId = 'EQSA-01'; //TODO: Create actual eventInstanceId do this on server-side?

      $scope.eventdoc.dateCreated = $scope.date;
    $http.get('/api/events/duplicate/' + $scope.eventdoc.eventName).then(function(res) {
      //console.log(res.data.duplicate);
      if ($scope.eventdoc.eventName.trim() === '') {
        ngNotifier.notifyError('Event name cannot be blank');
      } else if ($scope.eventdoc.eventName.replace(/ /g, '').match(/^[0-9]+$/) != null) {
        ngNotifier.notifyError('Event name cannot contain only numbers');
      } else if (res.data.duplicate) {
        ngNotifier.notifyError('Cannot create event. Duplicate name');
      } else if ($scope.eventdoc.eventType === '') {
        ngNotifier.notifyError('Please select an event type');
      } else {


        $scope.eventdoc.dateCreated = $scope.date;
        $scope.eventdoc.draftStatus = false;
        // if (draftInstance)
        //   $scope.eventdoc._id = draftInstance._id;

        var partialId = genInstanceId($scope.eventdoc.eventName);

        $http.get('/api/events/getAvailEventId/' + partialId).then(function(res) {
          //       	console.log(partialId);
          //        console.log(res.data);
          if (res.data) {
            //var eventInstanceIdParts = res.data.eventInstanceId.split("-");
            //$scope.eventInstanceId= eventInstanceIdParts[0] + '-' + String('0'+(Number(eventInstanceIdParts[1]) + 1));
            if (res.data.length > 0) {
              //                console.log("ID alreADy prsent");
              $scope.eventdoc.eventInstanceId = partialId + "xx";
            } else {
              //                console.log("id available to be used");
              //                console.log(partialId);
              $scope.eventdoc.eventInstanceId = partialId;
            }

            //			console.log("eventIDNew",$scope.eventdoc.eventInstanceId);


            //			console.log($scope.eventdoc);
            //			console.log($scope.eventdoc.eventInstanceId);
            $http.post('/api/events', $scope.eventdoc).then(function(res) {

              if (res.data.success) {
                ngNotifier.notify("Event has been created!");
                $location.path('/dashboard/');

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

  $scope.saveDraftEvent = function(clicked) {

      console.log($scope.date);
      $scope.eventdoc.dateCreated = $scope.date;

    $http.post('/api/events/drafts', $scope.eventdoc).then(function(res) {

      console.log(res.data);
      if (res.data.type=="update") {
        
        //

        if (clicked=="clicked") {
          ngNotifier.notify("Your event has been saved under drafts");
          //$location.path("/dashboard/drafts");
          //$scope.ok();

        } else {
          // if (res.data.newId) {
            
          //   previousData = angular.toJson($scope.eventdoc);
          // }
          ngNotifier.notify("Your event has been saved under drafts automatically.");
        }



      }
      else if(res.data.type=="insert")
      {
        ngNotifier.notify("Your event has been saved under drafts");
        $scope.eventdoc = res.data.eventdoc;
      }

       else {
        alert('A problem was encountered with saving this event. Please contact the admistrator.');
      }
    });


  };


  function getLatestInstance(partialId) {
    console.log(partialId);

    $http.get('/api/events/getAvailEventId/' + partialId).then(function(res) {
      console.log(partialId);
      console.log(res.data);
      if (res.data) {
        //var eventInstanceIdParts = res.data.eventInstanceId.split("-");
        //$scope.eventInstanceId= eventInstanceIdParts[0] + '-' + String('0'+(Number(eventInstanceIdParts[1]) + 1));
        if (res.data.length > 0) {
          console.log("ID alreADy prsent");
          return partialId + "xx";
        } else {
          console.log("id available to be used");
          console.log(partialId);
          return partialId;
        }

      } else {
        alert('no data received, assign new id');
      }
    });


  }

  function genInstanceId(eventName) {
    var nameComponent = eventName.toUpperCase().split(' ');
    var instanceId;
    if (nameComponent.length > 1)
      instanceId = nameComponent[0].substr(0, 2) + nameComponent[1].substr(0, 2) + '-' + '01';
    else
      instanceId = nameComponent[0].substr(0, 4) + '-' + '01';
    return instanceId;
  }

  // $scope.checkDirty = function() {
  //   console.log('check dirty fired');
  //   if (previousData !== angular.toJson($scope.eventdoc)) {
  //     $scope.saveDraftEvent('Yes');
  //     previousData = angular.toJson($scope.eventdoc);
  //   }


  // };

var unregister=$scope.$watch('eventdoc', function(newVal, oldVal){
   console.log("watching");
    if(newVal!=oldVal)
    {
      console.log('changed');
      $scope.allowSaveDrafts=true;
      unregister();
    }
   
}, true);


});