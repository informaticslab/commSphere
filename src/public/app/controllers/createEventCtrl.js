angular.module('app').controller('createEventCtrl', function($scope, $http, $filter, $route, ngNotifier,$location,$interval,$animate,ngIdentity, ngUser,$log,ngEventIdService) {
$scope.identity = ngIdentity;

$animate.enabled(false);
$scope.allowSaveDrafts=false;
  var secondUnit = 1000;
  var autoSave;
  var oKtoSave = false;

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
        $location.path('/dashboard/drafts');
      }
      
    }
    $interval.cancel(autoSave);

  });


  
  $scope.topicValue = {};
  $scope.subTopicValue = {};
  $scope.userAssigned = {};

  $scope.users = [];
  $scope.eventTypes = [];

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

  console.log($scope.isNew);
  //retrieve list of event types from db for dropdown
  $http.get('/api/eventTypes').then(function(res) {
    if (res.data.length != 0) {
      var types = res.data[0].eventTypeList[0].eventTypes;
      for (var i = 0; i < types.length; i++) {
        $scope.eventTypes.push(types[i].name);
      }
    }
  });
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
  

  $scope.addTopic = function(category,e) {
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
        bullets: [],
        sortOrder: category.topics.length
      });

    }
    $scope.topicValue = {};
    e.preventDefault();
  };

  $scope.editTopic = function(topic) {
    topic.editing = true;
  };

  $scope.cancelEditingTopic = function(topic) {
    topic.editing = false;
  };

  $scope.saveTopic = function(topic,e) {
    // topic.save();
    topic.editing = false;
    e.preventDefault();
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

  $scope.addSubTopic = function(topic,e) {
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
    e.preventDefault();
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
    $log.debug("edit sub topic",subTopic);
    subTopic.editing = true;
  };

  $scope.saveSubTopic = function(subTopic,e) {
    // topic.save();
    subTopic.editing = false;
    e.preventDefault();
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
    var workingId="";
    for(var i=0; i < $scope.eventdoc.categories.length; i++){
      if($scope.eventdoc.categories[i].userAssigned != '') {
        minimumAssign = true;
      }
    }
      //validation before event creation
      if ($scope.eventdoc.eventName.trim() === '') {
        ngNotifier.notifyError('Event name cannot be blank');
      } else if ($scope.eventdoc.eventName.replace(/ /g, '').match(/^[0-9]+$/) != null) {
        ngNotifier.notifyError('Event name cannot contain only numbers');
      } else if ($scope.eventdoc.eventName.replace(' ','').trim().length < 4) {
       ngNotifier.notifyError('Event name must be at least 4 characters');
      } 
       else if ($scope.eventdoc.eventType === '') {
        ngNotifier.notifyError('Please select an event type');
      } else if (minimumAssign === false){
        ngNotifier.notifyError('You must assign atleast one category to an analyst');
      }
      else { // validation passed continue to check event Id logic
          if ($scope.isNew)
          {  //creating brand new event 
              $http.get('/api/events/duplicate/' + $scope.eventdoc.eventName).then(function(res)
              {
                console.log(' check duplicate', res);
                if (res.data.duplicate){
                     ngNotifier.notifyError("Event name already exists");
                     oKtoSave= false;
                 }
                 else
                  { // name not exist, generate primary portion
                        console.log('name not exist');
                        primaryId = genPrimaryId($scope.eventdoc.eventName);
                        console.log('primary id ', primaryId);
                        $http.get('/api/events/getAvailEventId/' + primaryId).then(function(result) {
                          if (result.data)
                          {  
                            if (result.data.length > 0)
                            {   console.log('primaryId already exist, append optional part' , result.data[0].eventInstanceId);
                                var idParts = result.data[0].eventInstanceId.split('_');
                                if (idParts.length === 1) {
                                   console.log('no existing id with optional part found, assign "A"');
                                   workingId = primaryId + '_' + 'A'+'-01';
                                   $http.get('/api/events/findDuplicateId/' + workingId).then(function(result) {
                                      if (result.data.duplicate){
                                          ngNotifier.notifyError("something wrong with ID generation.  Please contact IT");
                                          oKtoSave = false;
                                      }
                                      else {
                                        $scope.eventdoc.eventInstanceId = workingId;
                                        oKtoSave = true;
                                        $scope.saveEvent();
                                      }

                                   })
                                }
                                else
                                {
                                   // get next available optional part
                                     console.log('i am in get next optional letter');
                                     //strip the '-xx' part
                                     currentChar = idParts[1].split('-')[0];
                                     workingId = primaryId + '_' +  nextChar(currentChar)+'-01';
                                     $http.get('/api/events/findDuplicateId/' + workingId).then(function(res) {
                                        if(res.data.duplicate)
                                         {
                                          // stop, something wrong
                                           ngNotifier.notifyError("something wrong with the ID generation, Please contact IT Support");
                                           oKtoSave= false;

                                         }
                                       else {
                                         console.log('workingId is valid', workingId);
                                         $scope.eventdoc.eventInstanceId = workingId;
                                         oKtoSave= true;
                                         $scope.saveEvent();
                                       }

                                     });
                                }

                            }
                            else
                             {
                               console.log('no primary exist, append suffix 01'); 
                               $scope.eventdoc.eventInstanceId = primaryId + '-' + '01';
                               oKtoSave = true;
                               $scope.saveEvent();
                            }
                          }
                       });
                 }
               
             })
          }
          else {// create from existing

          }
     }
                             
     
                 
     $animate.enabled(true);
     
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

  $scope.checkDuplicateName = function(eventName)
  {
    $http.get('/api/events/duplicate/' + eventName).then(function(res) {
          if (res.data) { 
                if (res.data.duplicate){
                     ngNotifier.notifyError("Event name already exists");
                 }
          }
          else
          {
            alert('no data received, assign new id');
            return false;
          }

        })
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


function genPrimaryId(eventName) {
      
      var tmpEventName = eventName.replace(" ","").trim().toUpperCase();
      var primaryId;
      if (tmpEventName.length >= 6) {
          primaryId = tmpEventName.substring(0,2)+ tmpEventName.substring(4,6);
      } else if (tmpEventName.length === 5){
        primaryId =  tmpEventName.substring(0,2)+ tmpEventName.substring(3,5);
      } else if (tmpEventName.length === 4){
          primaryId = tmpEventName;
      }
        return primaryId;  
    }

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function getnextNum(numText) {

    increment =   Number(numText)+1;
    if (increment < 10) 
    {
        return ("0" + increment);
    }
    else {
        return +increment;
    }
  }

$scope.saveEvent = function()
{
  // saving the document here
    $scope.eventdoc.dateCreated = $scope.date;
    $scope.eventdoc.draftStatus = false;  
    $http.post('/api/events', $scope.eventdoc).then(function(res) {
       if (res.data.success) {
         ngNotifier.notify("Event has been created!");
         $location.path('/dashboard/');
        
       } 
       else {
         alert('there was an error');
       }
     });
     $scope.ok();
}

});
