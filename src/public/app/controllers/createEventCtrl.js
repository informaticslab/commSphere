angular.module('app').controller('createEventCtrl', function($scope, $http, $filter, $route, ngNotifier,$location,$interval,$animate,ngIdentity, ngUser,$log) {
$scope.identity = ngIdentity;

$animate.enabled(false, 'div');
$scope.allowSaveDrafts=false;
  var secondUnit = 1000;
  var autoSave;

  autoSave = $interval(function() {
  // repeat check if eventdoc has been changed for every 150 seconds.   
    $scope.checkDirty();
  }, 150 * secondUnit);  // change time delay here


  $scope.$on('$destroy', function() {
  // do a final save if user close the screen
    $log.debug($scope.eventdoc );
    if($scope.eventdoc.draftStatus)
    {
      if($scope.allowSaveDrafts)
      {
        $log.debug("saving");
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
      name: 'Traditional News Media',
      "userAssigned": "",
      "statusCompleted": false,
      "dateCompleted": "",
      topics: [

      ]
    }, {
      name: 'Social Media',
      "userAssigned": "",
      "statusCompleted": false,
      "dateCompleted": "",
      topics: [

      ]
    }]
  };

  if ($scope.draftInstance) {
    $scope.eventdoc = $scope.draftInstance;
  }


  $scope.eventTypes = ['Earthquake', 'Hurricane', 'Flood', 'Infectious Disease', 'Famine'] //hardcoded placeholder
  $scope.date = new Date().getTime(); // need both date and time

  //create an object with ID and displayName for userCreated.
  $scope.eventdoc.userCreated = {id:$scope.identity.currentUser._id, displayName: $scope.identity.currentUser.displayName};

  var previousData = angular.toJson($scope.eventdoc);

  //retrieve list of analysts from db for dropdown
  $http.get('/api/users/analysts').then(function(res) {
  var analysts = res.data;
  for(var i=0; i < analysts.length; i++) {
    $scope.users.push({'id':analysts[i]._id, 'displayName':analysts[i].displayName });
  }
  });

  $log.debug($scope.date);
  

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
    $log.debug("edit sub topic");
    subTopic.editing = true;
  };

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
    $log.debug($scope.eventdoc.eventInstanceId);
    var minimumAssign = false;
    for(var i=0; i < $scope.eventdoc.categories.length; i++){
      if($scope.eventdoc.categories[i].userAssigned != '') {
        minimumAssign = true;
      }
    }
    $scope.eventdoc.dateCreated = $scope.date;
    $http.get('/api/events/duplicate/' + $scope.eventdoc.eventName).then(function(res) {

      //validation before event creation
      if ($scope.eventdoc.eventName.trim() === '') {
        ngNotifier.notifyError('Event name cannot be blank');
      } else if ($scope.eventdoc.eventName.replace(/ /g, '').match(/^[0-9]+$/) != null) {
        ngNotifier.notifyError('Event name cannot contain only numbers');
      } else if (res.data.duplicate) {
        ngNotifier.notifyError('Cannot create event. Duplicate name');
      } else if ($scope.eventdoc.eventType === '') {
        ngNotifier.notifyError('Please select an event type');
      } else if (minimumAssign === false){
        ngNotifier.notifyError('You must assign atleast one category to an analyst');
      } else {


        $scope.eventdoc.dateCreated = $scope.date;
        $scope.eventdoc.draftStatus = false;
 
        var partialId = genInstanceId($scope.eventdoc.eventName); // get next avail id

        $http.get('/api/events/getAvailEventId/' + partialId).then(function(res) {
          // check against database for existing document with the same id 
          if (res.data) {
            if (res.data.length > 0) {
              $scope.eventdoc.eventInstanceId = partialId + "xx";
            } else {
              $scope.eventdoc.eventInstanceId = partialId;
            }

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

      $log.debug($scope.date);
      $scope.eventdoc.dateCreated = $scope.date;

    $http.post('/api/events/drafts', $scope.eventdoc).then(function(res) {

      $log.debug(res.data);
      if (res.data.type=="update") {
        
        //

        if (clicked=="clicked") {
          ngNotifier.notify("Your event has been saved under drafts");
        } else {
          ngNotifier.notify("Your event has been saved under drafts automatically.");
        }



      }
      else if(res.data.type=="insert")
      {
        ngNotifier.notify("Your event has been saved under drafts");
        $scope.eventdoc = res.data.eventdoc;
        previousData = angular.toJson($scope.eventdoc);

      }

       else {
        alert('A problem was encountered with saving this event. Please contact the admistrator.');
      }
    });


  };


  function getLatestInstance(partialId) {
    $log.debug(partialId);

    $http.get('/api/events/getAvailEventId/' + partialId).then(function(res) {
      $log.debug(partialId);
      $log.debug(res.data);
      if (res.data) {
        if (res.data.length > 0) {
          $log.debug("ID alreADy prsent");
          return partialId + "xx";
        } else {
          $log.debug("id available to be used");
          $log.debug(partialId);
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

   $scope.checkDirty = function() {
     // this function compare previously saved copy of eventdoc against the current eventdoc
     // if they are not the same then save the current eventdoc
     $log.debug('check dirty fired');
     if (previousData !== angular.toJson($scope.eventdoc)) {
     $scope.saveDraftEvent('Yes');
     // re-initialize and wait for the next check
      previousData = angular.toJson($scope.eventdoc);
   }


  };

var unregister=$scope.$watch('eventdoc', function(newVal, oldVal){
   $log.debug("watching");
    if(newVal!=oldVal)
    {
      $log.debug('changed');
      $scope.allowSaveDrafts=true;
      unregister();
    }
   
}, true);


});