angular.module('app').controller('createEventCtrl', function($scope, $http, $filter, $route, ngNotifier,$location,$interval,$animate,ngIdentity, ngUser,$log,ngEventIdService,$q) {
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

  var changeWatcher = function() {   //function to watch for changes on eventdoc
    var unregister = $scope.$watch('eventdoc', function(newVal, oldVal) {
      $log.debug("watching");
      if (newVal != oldVal) {
        $log.debug('changed');
        $scope.allowSaveDrafts = true;
        unregister();
      }

    }, true);
  };

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
    categories: []
  };

  if ($scope.draftInstance) {
    $scope.eventdoc = $scope.draftInstance;
  }


  //created from existing event
  if (!$scope.isNew) {
    $scope.savedEventName = $scope.eventdoc.eventName;
    $scope.eventNameReadonly = true;
    $scope.eventNameOverrideDisable = false;
    changeWatcher();
    
  //new event 
  } else {                                           
    $scope.eventNameOverride = $scope.isNew;
    $scope.eventNameReadonly = false;
    $scope.eventNameOverrideDisable = true;

    //retrieve list of category names from db for tabs
    $http.get('/api/categories').then(function(res) {
      if (res.data[0].categoryList[0].length != 0) {
        var cats = res.data[0].categoryList[0].categories;
        for (var i = 0; i < cats.length; i++) {
          $scope.eventdoc.categories.push(cats[i]);
        }
        changeWatcher();
      }
    });

  }

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
    for (var i = 0; i < analysts.length; i++) {
      $scope.users.push({
        'id': analysts[i]._id,
        'displayName': analysts[i].displayName
      });
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
 //   var checkNamedeferred = $q.defer();
 //   checkNamedeferred.promise

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
            // checking if name already exist
            $http.get('/api/events/duplicate/' + $scope.eventdoc.eventName).then(function(res) {
            if (res.data) { 
                if (res.data.duplicate){
                     ngNotifier.notifyError("Event name already exists");
                 }
                else {
                        $http.get('/api/getNextAutoId/').then(function(result) {
                          $scope.eventdoc.eventInstanceId = genPrimaryId($scope.eventdoc.eventName) + result.data.availNumber+'-001';
                          $scope.saveEvent();
                        });
                }
            }
           
          });
               
          }
          else {// create from existing
                 var primaryId = $scope.eventdoc.eventInstanceId.split('-')[0];
                 // check for the latest instance
                 console.log(primaryId);
                 $http.get('/api/events/getAvailEventId/' + primaryId).then(function (res) {
                  if (res.data.length>0) {
                     //break apart and reassemble
                       var idParts = res.data[0].eventInstanceId.split('-');
                       $scope.eventdoc.eventInstanceId = idParts[0]+ '-' + getnextNum(idParts[1]);
                       $scope.saveEvent();
                  }
                });
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



function getnextNum(numText) {

    increment =   Number(numText)+1;
    if (increment < 100) 
    {
        return ("00" + increment);
    }
    else {
        return +increment;
    }
  }


function genPrimaryId(eventName) {
      var skipWords = ["THE", "A", "AND"];
      var nonBlanks = [];
      var eventNameParts = eventName.split(' ');
      for (var i = 0; i < eventNameParts.length; i++) {
          if (eventNameParts[i] != ""){
             nonBlanks.push(eventNameParts[i]);
          }
      }
      if (skipWords.indexOf(eventNameParts[0].toUpperCase()) == -1) {
           tmpEventName = nonBlanks[0].substring(0,2).toUpperCase();   
      }
      else {
         // make
           tmpEventName =  nonBlanks[1].substring(0,2); 
      } 
          
      return tmpEventName;
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


$scope.setOverrideFlags = function() {
   
 
   if($scope.eventNameOverride) {  // user checked the override box
      $scope.isNew = true;
      $scope.eventNameReadonly = false;
   }
   else {// user unchecked the box
      // reset the name
      $scope.eventdoc.eventName = $scope.savedEventName;
      $scope.isNew = false;
      $scope.eventNameReadonly = true;
   }
} 

});
